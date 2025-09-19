import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { PaginationDto, PaginationDtoBase } from 'src/utils/paganation.dto';
import { CreateProductDto } from './dto/product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Auth()
  @Get()
  @HttpCode(HttpStatus.OK)
  public async search(@Query() p: PaginationDtoBase) {
    return await this.productService.getAll(p);
  }

  @Auth()
  @Get('by-slug/:slug')
  @HttpCode(HttpStatus.OK)
  public async getAllByCategorySlug(@Query() pagination: PaginationDto, @Param('slug') slug: string) {
    return await this.productService.getAllByCategorySlug(pagination, slug);
  }

  @Auth()
  @Post()
  @HttpCode(HttpStatus.OK)
  public async create(@Body() dto: CreateProductDto) {
    return await this.productService.create(dto);
  }


}
