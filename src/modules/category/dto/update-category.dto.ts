import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateCategoryDto {
    @ApiProperty({
        description: 'Идентификатор категории',
    })
    @IsString({ message: 'Значение должно быть строкой' })
    id: string;

    @ApiProperty({
        required: false,
        description: 'Уникальное название категории на англ.языке',
    })
    @IsOptional()
    @IsString({ message: 'Поле должно являться строкой' })
    @Matches(new RegExp('^[A-Za-z\\s]*$'), { message: 'Значение должно содержать англ. буквы' })
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            return value.trim();
        }
    })
    slug?: string;

    @ApiProperty({
        required: false,
        description: 'Название категории',
    })
    @IsOptional()
    @IsString({ message: 'Поле должно являться строкой' })
    @Matches(new RegExp('^[A-Za-zА-Яа-яЁё\\s]*$'), { message: 'Значение должно содержать англ. или русские буквы' })
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            return value.trim();
        }
    })
    name?: string;

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
        required: false,
        description: 'Активность категории',
    })
    @IsOptional()
    @IsBoolean({ message: 'Поле должно быть булевым значением' })
    active?: boolean;
}
