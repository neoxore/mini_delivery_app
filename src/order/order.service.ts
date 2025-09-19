import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { returnProductObject } from 'src/product/return-product.object';
import { PaginationDtoBase } from 'src/utils/paganation.dto';
import Stripe from 'stripe';
import { OrderDto } from './dto/order.dto';

@Injectable()
export class OrderService {
    private stripe: Stripe
    private STRIPE_SECRET_KEY: string
    constructor(
        private readonly prismaService: PrismaService,
        private readonly configService: ConfigService,
    ) {
        this.STRIPE_SECRET_KEY = configService.getOrThrow<string>('STRIPE_SECRET_KEY');
        this.stripe = new Stripe(this.STRIPE_SECRET_KEY)
    }

    public async getAll(p: PaginationDtoBase) {
        const { page, limit } = p;
        const skip = (page - 1) * limit

        const [items, total] = await this.prismaService.$transaction([
            this.prismaService.order.findMany({
                orderBy: { createdAt: 'desc' },
                take: limit,
                skip,
                include: {
                    OrderItem: {
                        include: {
                            product: { select: returnProductObject },
                        },
                    },
                },
            }),
            this.prismaService.order.count(),
        ]);

        return {
            items,
            meta: {
                total, page, limit,
                pages: Math.ceil(total / limit),
                hasPrev: page > 1,
                hasNext: skip + items.length < total,
            },
        };
    }

    public async getByUserId(userId: string, p: PaginationDtoBase) {
        const { page, limit } = p;
        const skip = (page - 1) * limit;

        const [items, total] = await this.prismaService.$transaction([
            this.prismaService.order.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                take: limit,
                skip,
                include: {
                    OrderItem: {
                        include: {
                            product: { select: returnProductObject },
                        },
                    },
                },
            }),
            this.prismaService.order.count()
        ]);

        return {
            items,
            meta: {
                total, page, limit,
                pages: Math.ceil(total / limit),
                hasPrev: page > 1,
                hasNext: skip + items.length < total,
            },
        };
    }

    public async placeOrer(userId: string, dto: OrderDto) {
        const total = dto.items.reduce(
            (acc, item) => acc + item.price * item.quantity, 0
        );

        if (total < 0.5) throw new Error('Amount must be at least $0.50 usd');

        const totalInCents = Math.round(total * 100);

        const order = await this.prismaService.order.create({
            data: { OrderItem: { create: dto.items }, total, user: { connect: { id: userId } } }
        });

        const pi = await this.stripe.paymentIntents.create({
            amount: totalInCents,
            currency: 'usd',
            automatic_payment_methods: {
                enabled: true
            },
            description: `Order by userId ${userId}`,
        })
        return { clientSecret: pi.client_secret };
    }
}
