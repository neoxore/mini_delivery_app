import { Body, Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { PaginationDtoBase } from 'src/utils/paganation.dto';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { OrderDto } from './dto/order.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  @Auth()
  public async getAll(@Query("p") p: PaginationDtoBase) {
    return await this.orderService.getAll(p);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  @Auth()
  public async getByUserId(@CurrentUser('id') userId: string, p: PaginationDtoBase) {
    return await this.orderService.getByUserId(userId, p);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  @Auth()
  public async placeOrder(@CurrentUser('id') userId: string, @Body() dto: OrderDto) {
    return await this.orderService.placeOrer(userId, dto);
  }

}