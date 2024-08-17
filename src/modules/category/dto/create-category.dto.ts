import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCategoryDto {
    @ApiProperty({
        description: 'Уникальное название на англ. в системе',
    })
    @IsString({ message: 'Поле должно являться строкой' })
    @Matches(new RegExp('^[A-Za-z\\s]*$'), { message: 'Значение должно содержать англ. буквы' })
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            return value.trim();
        }
    })
    slug: string;

    @ApiProperty({
        description: 'Название категории',
    })
    @IsString({ message: 'Поле должно являться строкой' })
    @Matches(new RegExp('^[A-Za-zА-Яа-яЁё\\s]*$'), { message: 'Значение должно содержать англ. или русские буквы' })
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            return value.trim();
        }
    })
    name: string;

    @ApiProperty({
        required: false,
        description: 'Описание категории',
    })
    @IsOptional()
    @IsString({ message: 'Поле должно являться строкой' })
    @Matches(new RegExp('^[A-Za-zА-Яа-яЁё\\s]*$'), { message: 'Значение должно содержать англ. или русские буквы' })
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            return value.trim();
        }
    })
    description?: string;

    @ApiProperty({
        description: 'Активность категории',
    })
    @IsBoolean({ message: 'Поле должно быть булевым значением' })
    active: boolean;
}
