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
     * @param query - Запрос
     * @return ICategory Категория
     */
    async getCategory(query: Prisma.categoryFindFirstArgs): Promise<ICategory> {
        try {
            return this.category.findFirst(query);
        } catch (e) {
            throw new HttpException('Ошибка получения категории', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Метод создания категории в БД
     * @param data - Данные категории
     * @return ICategory Созданная категория
     */
    async createCategory(data: Prisma.categoryCreateInput): Promise<ICategory> {
        try {
            return await this.category.create({
                data,
            });
        } catch (e) {
            throw new HttpException('Ошибка при создании категории', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Метод удаления категории из БД
     * @param query - Запрос
     * @return ICategory Удаленная категория
     */
    async deleteCategory(query: Prisma.categoryDeleteArgs): Promise<ICategory> {
        try {
            return this.category.delete(query);
        } catch (e) {
            throw new HttpException('Ошибка при удалении категории', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
