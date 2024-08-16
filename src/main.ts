import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { ValidateExeceptionFilter } from './filters/validate-exeception.filter';
import { ValidationPipe } from '@nestjs/common';
import { ValidateException } from './exceptions/validate.exception';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configSwagger = new DocumentBuilder().setTitle('Тестовое задание СКБ').build();
    const documentSwagger = SwaggerModule.createDocument(app, configSwagger);
    SwaggerModule.setup('api', app, documentSwagger);

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            exceptionFactory: (errors) => new ValidateException(errors),
        }),
    );
    app.useGlobalFilters(new HttpExceptionFilter(), new ValidateExeceptionFilter());

    await app.listen(3000);
}
bootstrap();
