import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, Matches } from 'class-validator';

export class CreateCategoryDto {
    @ApiProperty({
        description: 'Уникальное название на англ. в системе',
    })
    @IsString({ message: 'Поле должно являться строкой' })
    @Matches(new RegExp('^[A-Za-z]*$'), { message: 'Значение должно содержать англ. буквы' })
    slug: string;

    @ApiProperty({
        description: 'Название категории',
    })
    @IsString({ message: 'Поле должно являться строкой' })
    @Matches(new RegExp('^[A-Za-zА-Яа-яЁё]*$'), { message: 'Значение должно содержать англ. или русские буквы' })
    name: string;

    @ApiProperty({
        required: false,
        description: 'Описание категории',
    })
    @IsOptional()
    @IsString({ message: 'Поле должно являться строкой' })
    @Matches(new RegExp('^[A-Za-zА-Яа-яЁё]*$'), { message: 'Значение должно содержать англ. или русские буквы' })
    description?: string;

    @ApiProperty({
        description: 'Активность категории',
    })
    @IsBoolean({ message: 'Поле должно быть булевым значением' })
    active: boolean;
}
