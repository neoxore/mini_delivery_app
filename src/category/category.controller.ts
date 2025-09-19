import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Auth()
  @Get()
  @HttpCode(HttpStatus.OK)
  public async getAll() {
    return await this.categoryService.getAll();
  }

  @Auth()
  @Get('by-id/:id')
  @HttpCode(HttpStatus.OK)
  public async getById(@Param('id') id: string) {
    return await this.categoryService.getById(id);
  }

  @Auth()
  @Get('by-slug/:slug')
  @HttpCode(HttpStatus.OK)
  public async getBySlug(@Param('slug') slug: string) {
    return await this.categoryService.getBySlug(slug);
  }

  @Auth()
  @Post('create')
  @HttpCode(HttpStatus.OK)
  public async create(@Body() dto: CreateCategoryDto) {
    return await this.categoryService.create(dto);
  }

  @Auth()
  @Patch('update/by-id/:id')
  @HttpCode(HttpStatus.OK)
  public async update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return await this.categoryService.update(id, dto);
  }
  



}
