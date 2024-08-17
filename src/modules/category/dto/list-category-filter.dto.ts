import { IsBoolean, IsNumber, IsOptional, IsString, Matches, Max, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class ListCategoryFilterDto {
    @IsOptional()
    @IsString()
    @Matches(new RegExp('^[A-Za-zА-Яа-яЁё\\s]*$'), { message: 'Значение должно содержать англ. или русские буквы' })
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            return value.trim();
        }
    })
    name?: string;

    @IsOptional()
    @IsString()
    @Matches(new RegExp('^[A-Za-zА-Яа-яЁё\\s]*$'), { message: 'Значение должно содержать англ. или русские буквы' })
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            return value.trim();
        }
    })
    description?: string;

    @IsOptional()
    @Transform(({ value }) => (value == '1' || value == 'true' ? true : value == '0' || value == 'false' ? false : undefined))
    @IsBoolean()
    active?: boolean;

    @IsOptional()
    @IsString()
    @Matches(new RegExp('^[A-Za-zА-Яа-яЁё\\s]*$'), { message: 'Значение должно содержать англ. или русские буквы' })
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            return value.trim();
        }
    })
    search?: string;

    @IsOptional()
    @IsNumber({}, { message: 'Значение должно быть числом' })
    @Min(1, { message: 'Значение должно быть больше 1' })
    @Max(9, { message: 'Значение должно быть меньше или равно 9' })
    @Transform(
        ({ value }) => {
            if (typeof value === 'string') {
                const trimTransformValue = Number(value.trim());
                return trimTransformValue === 0 ? 2 : trimTransformValue;
            }
            return value;
        },
        { toClassOnly: true },
    )
    pageSize?: number = 2;

    @IsOptional()
    @IsNumber({}, { message: 'Значение должно быть числом' })
    @Min(0, { message: 'Значение должно быть больше или равно 0' })
    @Transform(
        ({ value }) => {
            if (typeof value === 'string') {
                const trimTransformValue = Number(value.trim());
                return trimTransformValue < 0 ? 0 : trimTransformValue;
            }
            return value;
        },
        { toClassOnly: true },
    )
    page?: number = 0;

    @IsOptional()
    @IsString()
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            return value.trim();
        }
    })
    sort?: string;
}
