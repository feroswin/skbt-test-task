import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ICategory } from '../../interfaces/category.interface';
import * as crypto from 'crypto';

@Injectable()
export class CategoryService {
    constructor(private readonly dbService: DbService) {}

    /**
     * Метод получения категории по id или slug
     * @param id - Идентификатор категории
     * @param slug - Уникальное название категории
     * @return ICategory Категория
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
     * @param body - Данные категории
     * @return ICategory Созданная категория
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

        return this.dbService.createCategory({ data: { id: crypto.randomUUID(), ...body } });
    }

    /**
     * Метод удаления категории
     * @param id - Идентификатор категории
     * @return ICategory Удаленная категория
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

        return this.dbService.deleteCategory({
            where: {
                id: id,
            },
        });
    }
}
