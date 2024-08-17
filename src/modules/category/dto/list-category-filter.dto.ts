import { IsBoolean, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class ListCategoryFilterDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @Transform(({ value }) => value == '1' || value == 'true')
    @IsBoolean()
    active?: boolean;

    @IsOptional()
    // @IsString()
    search?: string;

    @IsOptional()
    @IsNumber({}, { message: 'Значение должно быть числом' })
    @Min(1, { message: 'Значение должно быть больше 1' })
    @Max(9, { message: 'Значение должно быть меньше или равно 9' })
    @Transform(({ value }) => Number(value))
    pageSize?: number = 2;

    @IsOptional()
    @IsNumber({}, { message: 'Значение должно быть числом' })
    @Min(0, { message: 'Значение должно быть больше или равно 0' })
    @Transform(({ value }) => Number(value))
    page?: number = 0;

    @IsOptional()
    @IsString()
    sort?: string;
}
