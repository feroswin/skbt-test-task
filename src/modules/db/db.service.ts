import { HttpException, HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { ICategory } from '../../interfaces/category.interface';

@Injectable()
export class DbService extends PrismaClient implements OnModuleInit {
    async onModuleInit() {
        await this.$connect();
    }

    /**
     * Метод получения категории из БД
     * @param {Prisma.categoryFindFirstArgs} query - Запрос
     * @return Полученная категория
     */
    async getCategory(query: Prisma.categoryFindFirstArgs): Promise<ICategory | undefined> {
        try {
            return await this.category.findFirst(query);
        } catch (e) {
            throw new HttpException('Ошибка получения категории', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Метод получения списка категорий из БД
     * @param query - Запрос
     * @return Список категорий
     */
    async getListCategory(query: Prisma.categoryFindManyArgs) {
        try {
            return await this.category.findMany(query);
        } catch (e) {
            throw new HttpException('Ошибка при получении категорий', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Метод создания категории в БД
     * @param {Prisma.categoryCreateArgs} query - Запрос
     * @return Созданная категория
     */
    async createCategory(query: Prisma.categoryCreateArgs): Promise<ICategory> {
        try {
            return await this.category.create(query);
        } catch (e) {
            throw new HttpException('Ошибка при создании категории', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Метод удаления категории из БД
     * @param {Prisma.categoryDeleteArgs} query - Запрос
     * @return Удаленная категория
     */
    async deleteCategory(query: Prisma.categoryDeleteArgs): Promise<ICategory> {
        try {
            return await this.category.delete(query);
        } catch (e) {
            throw new HttpException('Ошибка при удалении категории', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Метод обновления категории
     * @param {Prisma.categoryUpdateArgs} query - Запрос
     * @return Обновленная категория
     */
    async updateCategory(query: Prisma.categoryUpdateArgs): Promise<ICategory> {
        try {
            return await this.category.update(query);
        } catch (e) {
            throw new HttpException('Ошибка при обновлении категории', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Метод подсчета количества категорий
     * @param {Prisma.categoryCountArgs} query - Запрос
     * @return Количество категорий
     */
    async countCategory(query: Prisma.categoryCountArgs): Promise<number> {
        try {
            return await this.category.count(query);
        } catch (e) {
            throw new HttpException('Ошибка при получении количества категорий', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
