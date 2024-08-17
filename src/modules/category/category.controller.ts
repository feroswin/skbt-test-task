import { Body, Controller, Delete, Get, Param, Patch, Post, Query, ValidationPipe } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CreateCategoryDto } from './dto/request/create-category.dto';
import { CategoryDto } from './dto/response/category.dto';
import { ICategory } from '../../interfaces/category.interface';
import { UpdateCategoryDto } from './dto/request/update-category.dto';
import { ListCategoryFilterDto } from './dto/request/list-category-filter.dto';
import { ListCategoryFilters } from '../../decorators/list-category-filters.decorator';

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

    @ListCategoryFilters()
    @ApiResponse({
        status: 200,
        type: [CategoryDto],
    })
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
