import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { returnUserObject } from './return-user.object';

@Injectable()
export class UserService {
    constructor(private readonly peismaService: PrismaService) {}

    public async getById(id: string) {
        const user = await this.peismaService.user.findUnique({ where: { id }, select: returnUserObject});

        if (!user) throw new NotFoundException('User not found');

        return user;
    }

    public async toggleFavorite(userId: string, productId: string) {
        const user = await this.getById(userId);

        const isExists = user.favorites.some(product => product.id === productId)

        await this.peismaService.user.update({
            where: { id: userId },
            data: {
                favorites: {
                    [isExists ? 'disconnect' : 'connect']: {
                        id: productId
                    },
                },
            },
    });
    return { message: 'Success'};
}
}
