import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ICategory } from '../../interfaces/category.interface';
import * as crypto from 'crypto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ListCategoryFilterDto } from './dto/list-category-filter.dto';
import { Prisma } from '@prisma/client';
import { hasPropertyCategoryInModel } from '../../helpers/hasPropertyInModel';

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

    async getListCategory(queryParams: ListCategoryFilterDto) {
        // console.log(queryParams);
        let where: Prisma.categoryWhereInput = {};
        let orderBy: Prisma.categoryOrderByWithRelationInput = {};

        if (queryParams.search) {
            where = {
                ...where,
                OR: [{ name: { search: queryParams.search } }, { description: { search: queryParams.search } }],
            };
        }

        if (queryParams.name && !queryParams.search) {
            where = {
                ...where,
                name: { search: queryParams.name },
            };
        }

        if (queryParams.description && !queryParams.search) {
            where = {
                ...where,
                description: { search: queryParams.description },
            };
        }

        if (queryParams.active !== undefined) {
            where = {
                ...where,
                active: queryParams.active,
            };
        }

        // console.log(queryParams);

        if (queryParams.sort) {
            const parseSortField = queryParams.sort.startsWith('-') ? queryParams.sort.split('-')[1] : queryParams.sort;

            const fieldForSort = hasPropertyCategoryInModel(parseSortField) ? parseSortField : 'createdDate';

            orderBy = {
                ...orderBy,
                [fieldForSort]: queryParams.sort.startsWith('-') ? 'desc' : 'asc',
            };
        } else {
            orderBy = {
                ...orderBy,
                createdDate: 'desc',
            };
        }

        return await this.dbService.getListCategory({
            where: where,
            take: queryParams.pageSize,
            skip: queryParams.pageSize * (queryParams.page === 1 ? 0 : queryParams.page),
            orderBy: orderBy,
        });
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
}
