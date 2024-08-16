import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryDto } from './dto/category.dto';
import { ICategory } from '../../interfaces/category.interface';

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
    @Get('one')
    getCategory(@Query('id') id?: string, @Query('slug') slug?: string): Promise<ICategory> {
        return this.categoryService.getCategory(id, slug);
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
    @Delete(':id')
    deleteCategory(@Param('id') id: string): Promise<ICategory> {
        return this.categoryService.deleteCategory(id);
    }
}
