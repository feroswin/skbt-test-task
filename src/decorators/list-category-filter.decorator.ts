import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function ListCategoryFilter() {
    return applyDecorators(
        ApiQuery({
            required: false,
            description: 'Название категории',
            name: 'name',
        }),
        ApiQuery({
            required: false,
            description: 'Описание категории',
            name: 'description',
        }),
        ApiQuery({
            required: false,
            description: 'Активность категории',
            name: 'active',
        }),
        ApiQuery({
            required: false,
            description: 'Поиск',
            name: 'search',
        }),
        ApiQuery({
            required: false,
            description: 'Кол-во записей на страницу',
            name: 'pageSize',
        }),
        ApiQuery({
            required: false,
            description: 'Номер страницы',
            name: 'page',
        }),
        ApiQuery({
            required: false,
            description: 'Сортировка',
            name: 'sort',
        }),
    );
}
