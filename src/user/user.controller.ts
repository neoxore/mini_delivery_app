import { Controller, Get, HttpCode, HttpStatus, Param, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/user.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Auth()
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  public async getById(@CurrentUser('id') id: string) {
    return this.userService.getById(id);
  }

  @Auth()
  @Patch('profile/favorites/:productId')
  @HttpCode(HttpStatus.OK)
  public async (@CurrentUser('id') userId: string, @Param('productId') productId: string) {
    return this.userService.toggleFavorite(userId, productId);
  }
}
