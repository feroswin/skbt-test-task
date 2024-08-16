import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ValidateException } from '../exceptions/validate.exception';
import { ValidationError } from 'class-validator';
import { Request, Response } from 'express';

@Catch(ValidateException)
export class ValidateExeceptionFilter implements ExceptionFilter {
    catch(
        exception: {
            response: Record<string, ValidationError>;
            status: number;
            options: any;
        },
        host: ArgumentsHost,
    ): any {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let errors: Record<string, string[]>;

        // Разбираем каждую ошибку
        Object.values(exception.response).map((error) => {
            errors = {
                ...errors,
                // Разбираем каждое ограничение в ошибки и добавляем ее в массив для свойства property
                [error.property]: Object.values(error.constraints).map((constraint) => {
                    return constraint;
                }),
            };
        });

        response.status(400).json({
            response: false,
            status: 400,
            message: 'Ошибка валидации данных',
            errors: errors,
            timestamp: new Date(),
            path: request.path,
        });
    }
}
