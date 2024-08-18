import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { CreateCategoryDto } from './dto/request/create-category.dto';
import { ICategory } from '../../interfaces/category.interface';
import * as crypto from 'crypto';
import { UpdateCategoryDto } from './dto/request/update-category.dto';
import { ListCategoryFilterDto } from './dto/request/list-category-filter.dto';
import { Prisma } from '@prisma/client';
import { ListCategoriesDto } from './dto/response/list-categories.dto';
import { CategoryDto } from './dto/response/category.dto';

@Injectable()
export class CategoryService {
    constructor(private readonly dbService: DbService) {}

    /**
     * Метод получения категории по id или slug
     * @param {string} id - Идентификатор категории
     * @param {string} slug - Уникальное название категории
     * @return Полученная категория
     */
    async getCategory(id: string, slug: string): Promise<ICategory> {
        // Получаем категорию из БД
        const category: ICategory | undefined = await this.dbService.getCategory({
            where: {
                OR: [{ id: id }, { slug: slug }],
            },
        });

        // Проверяем существует ли категория
        if (!category) {
            throw new HttpException('Категория не найдена', HttpStatus.NOT_FOUND);
        }

        // Возвращаем категорию
        return category;
    }

    async getListCategory(queryParams: ListCategoryFilterDto): Promise<ListCategoriesDto> {
        // Создаем выражение условия для выборки
        const where: Prisma.categoryWhereInput = this.buildWhereCondition(queryParams);
        // Создаем выражение сортировки для выборки
        const orderBy: Prisma.categoryOrderByWithRelationInput = this.buildOrderByCondition(queryParams);

        // Получаем количество категорий в зависимости от условия выборки
        const countCategory = await this.dbService.countCategory({ where });

        // Получаем список категорий
        const listCategories: CategoryDto[] = await this.dbService.getListCategory({
            where,
            take: queryParams.pageSize,
            skip: queryParams.pageSize * (queryParams.page === 1 ? 0 : queryParams.page - 1 < 0 ? queryParams.page : queryParams.page - 1),
            orderBy,
        });

        // Возвращаем ответ пользователю
        return {
            categories: listCategories,
            count: countCategory,
        };
    }

    /**
     * Метод создания категории
     * @param {CreateCategoryDto} body - Данные категории
     * @return Созданная категория
     */
    async createCategory(body: CreateCategoryDto): Promise<ICategory> {
        // Получаем категорию из БД по slug
        const category: ICategory | undefined = await this.dbService.getCategory({
            where: {
                slug: body.slug,
            },
        });

        // Проверяем существует ли категория с таким slug
        if (category) {
            throw new HttpException('Категория с таким уникальным названием уже существует', HttpStatus.CONFLICT);
        }

        // Создаем категорию в БД и возвращаем результат
        return await this.dbService.createCategory({ data: { id: crypto.randomUUID(), ...body } });
    }

    /**
     * Метод обновления категории
     * @param {UpdateCategoryDto} body - Данные категории
     * @return Обновленная категория
     */
    async updateCategory(body: UpdateCategoryDto): Promise<ICategory> {
        // Деструктурируем данные
        const { id: idCategory, ...dataForUpdate } = body;

        // Проверяем есть ли хотя бы одно поле для обновления категории
        if (!Object.keys(dataForUpdate).some((item) => item !== undefined)) {
            throw new HttpException('Для обновления необходимо изменить хотя бы одно поле', HttpStatus.BAD_REQUEST);
        }

        // Получаем категорию из БД
        const category: ICategory | undefined = await this.dbService.getCategory({ where: { id: idCategory } });

        // Проверяем существует ли категория в БД
        if (!category) {
            throw new HttpException('Категория с таким id не найдена', HttpStatus.NOT_FOUND);
        }

        // Обновляем категорию и возвращаем результат
        return await this.dbService.updateCategory({ where: { id: idCategory }, data: dataForUpdate });
    }

    /**
     * Метод удаления категории
     * @param {string} id - Идентификатор категории
     * @return Удаленная категория
     */
    async deleteCategory(id: string): Promise<ICategory> {
        // Получаем категорию из БД по id
        const category: ICategory | undefined = await this.dbService.getCategory({
            where: {
                id: id,
            },
        });

        // Проверяем существует ли категория
        if (!category) {
            throw new HttpException('Категория с таким идентификатором не найдена', HttpStatus.NOT_FOUND);
        }

        // Удаляем категорию и возвращаем результат
        return await this.dbService.deleteCategory({
            where: {
                id: id,
            },
        });
    }

    /**
     * Метод создания выражения условия для выборки
     * @param {ListCategoryFilterDto} queryParams - Параметры запроса
     * @return Выражение условия для выборки
     * @private
     */
    private buildWhereCondition(queryParams: ListCategoryFilterDto): Prisma.categoryWhereInput {
        const where: Prisma.categoryWhereInput = {};

        // Если параметр search установлен
        if (queryParams.search) {
            // Делаем поиск по полям name и description
            where.OR = [{ name: { search: queryParams.search } }, { description: { search: queryParams.search } }];
        } else {
            // Если параметр search не установлен и параметры name и description присутствуют
            // Если параметр name установлен
            if (queryParams.name) {
                // Делаем поиск по полю name
                where.name = { search: queryParams.name };
            }

            // Если параметр description установлен
            if (queryParams.description) {
                // Делаем поиск по полю description
                where.description = { search: queryParams.description };
            }
        }

        // Если параметр active является undefined значит значение active валидно для нас
        if (queryParams.active !== undefined) {
            // Делаем поиск по полю active
            where.active = queryParams.active;
        }

        // Возвращаем выражение условия для выборки
        return where;
    }

    /**
     * Метод создания выражения сортировки для выборки
     * @param {ListCategoryFilterDto} queryParams - Параметры запроса
     * @return Выражение сортировки для выборки
     * @private
     */
    private buildOrderByCondition(queryParams: ListCategoryFilterDto): Prisma.categoryOrderByWithRelationInput {
        // Устанавливаем поле по умолчанию
        let orderByField = 'createdDate';
        // Устанавливаем направление сортировки по умолчанию
        let sortOrder: 'asc' | 'desc' = 'desc';

        // Если поле sort есть в параметрах запроса
        if (queryParams.sort) {
            // Разбираем поле сортировки
            orderByField = queryParams.sort.startsWith('-') ? queryParams.sort.substring(1) : queryParams.sort;
            // Разбираем направление сортировки для поля
            sortOrder = queryParams.sort.startsWith('-') ? 'desc' : 'asc';

            // Если поле не существует в категории, то выставляем поле и направление сортировки по умолчанию
            if (!this.hasPropertyCategoryInModel(orderByField)) {
                orderByField = 'createdDate';
                sortOrder = 'desc';
            }
        }
        // Возвращаем выражение сортировки для выборки
        return { [orderByField]: sortOrder };
    }

    /**
     * Метод наличия свойства в модели категории
     * @param {string} property - Название проверяемого свойство
     * @return Наличие свойства в модели категории
     * @private
     */
    private hasPropertyCategoryInModel(property: string): boolean {
        const validFields = ['id', 'name', 'description', 'active', 'createdDate'];
        return validFields.includes(property);
    }
}
