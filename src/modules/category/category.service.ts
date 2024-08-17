import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ICategory } from '../../interfaces/category.interface';
import * as crypto from 'crypto';
import { UpdateCategoryDto } from './dto/update-category.dto';

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
        const category: ICategory | undefined = await this.dbService.getCategory({
            where: {
                OR: [{ id: id }, { slug: slug }],
            },
        });

        if (!category) {
            throw new HttpException('Категория не найдена', HttpStatus.NOT_FOUND);
        }

        return category;
    }

    /**
     * Метод создания категории
     * @param {CreateCategoryDto} body - Данные категории
     * @return Созданная категория
     */
    async createCategory(body: CreateCategoryDto): Promise<ICategory> {
        const category: ICategory | undefined = await this.dbService.getCategory({
            where: {
                slug: body.slug,
            },
        });

        if (category) {
            throw new HttpException('Категория с таким уникальным названием уже существует', HttpStatus.CONFLICT);
        }

        return await this.dbService.createCategory({ data: { id: crypto.randomUUID(), ...body } });
    }

    /**
     * Метод обновления категории
     * @param {UpdateCategoryDto} body - Данные категории
     * @return Обновленная категория
     */
    async updateCategory(body: UpdateCategoryDto): Promise<ICategory> {
        const { id: idCategory, ...dataForUpdate } = body;

        if (!Object.keys(dataForUpdate).some((item) => item !== undefined)) {
            throw new HttpException('Для обновления необходимо изменить хотя бы одно поле', HttpStatus.BAD_REQUEST);
        }

        const category: ICategory | undefined = await this.dbService.getCategory({ where: { id: idCategory } });

        if (!category) {
            throw new HttpException('Категория с таким id не найдена', HttpStatus.NOT_FOUND);
        }

        return await this.dbService.updateCategory({ where: { id: idCategory }, data: dataForUpdate });
    }

    /**
     * Метод удаления категории
     * @param {string} id - Идентификатор категории
     * @return Удаленная категория
     */
    async deleteCategory(id: string): Promise<ICategory> {
        const category: ICategory | undefined = await this.dbService.getCategory({
            where: {
                id: id,
            },
        });

        if (!category) {
            throw new HttpException('Категория с таким идентификатором не найдена', HttpStatus.NOT_FOUND);
        }

        return await this.dbService.deleteCategory({
            where: {
                id: id,
            },
        });
    }
}
