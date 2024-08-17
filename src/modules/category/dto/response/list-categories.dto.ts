import { ApiProperty } from '@nestjs/swagger';
import { CategoryDto } from './category.dto';

export class ListCategoriesDto {
    @ApiProperty({
        description: 'Список категорий',
        type: [CategoryDto],
    })
    categories: CategoryDto[];

    @ApiProperty({
        description: 'Количество категорий',
    })
    count: number;
}
