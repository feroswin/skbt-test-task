import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

interface IResponse {
    response: boolean;
    status: number;
    message: string;
    timestamp: Date;
    path: string;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost): any {
        const ctx = host.switchToHttp();

        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const message = exception.getResponse();
        const status = exception.getStatus();
        let responseMessage: IResponse;

        if (typeof message === 'string') {
            responseMessage = {
                response: false,
                status: status,
                message: message,
                timestamp: new Date(),
                path: request.path,
            };
        }

        response.status(status).json({
            ...responseMessage,
        });
    }
}
