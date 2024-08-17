import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, ValidationPipe } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryDto } from './dto/category.dto';
import { ICategory } from '../../interfaces/category.interface';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ListCategoryFilter } from '../../decorators/list-category-filter.decorator';
import { ListCategoryFilterDto } from './dto/list-category-filter.dto';

@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @ApiQuery({
        required: false,
        name: 'id',
        type: String,
    })
    @ApiQuery({
        required: false,
        name: 'slug',
        type: String,
    })
    @ApiResponse({
        status: 200,
        type: CategoryDto,
    })
    @Get()
    getCategory(@Query('id') id?: string, @Query('slug') slug?: string): Promise<ICategory> {
        return this.categoryService.getCategory(id, slug);
    }

    @ListCategoryFilter()
    @Get('list')
    getListCategory(
        @Query(
            new ValidationPipe({
                transform: true,
                transformOptions: { enableImplicitConversion: true },
            }),
        )
        queryParams: ListCategoryFilterDto,
    ) {
        return this.categoryService.getListCategory(queryParams);
    }

    @ApiResponse({
        status: 201,
        type: CategoryDto,
    })
    @Post()
    createCategory(@Body() body: CreateCategoryDto): Promise<ICategory> {
        return this.categoryService.createCategory(body);
    }

    @ApiResponse({
        status: 200,
        type: CategoryDto,
    })
    @Patch()
    updateCategory(@Body() body: UpdateCategoryDto): Promise<ICategory> {
        return this.categoryService.updateCategory(body);
    }

    @ApiResponse({
        status: 200,
        type: CategoryDto,
    })
    @Delete(':id')
    deleteCategory(@Param('id') id: string): Promise<ICategory> {
        return this.categoryService.deleteCategory(id);
    }
}
