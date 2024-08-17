import { ApiProperty } from '@nestjs/swagger';

export class CategoryDto {
    @ApiProperty({
        description: 'Идентификатор категории',
    })
    id: string;

    @ApiProperty({
        description: 'Уникальное название на английском языке',
    })
    slug: string;

    @ApiProperty({
        description: 'Название категории',
    })
    name: string;

    @ApiProperty({
        description: 'Описание категории',
    })
    description: string;

    @ApiProperty({
        description: 'Дата создания',
    })
    createdDate: Date;

    @ApiProperty({
        description: 'Активность категории',
    })
    active: boolean;
}
