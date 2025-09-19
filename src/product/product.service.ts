import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { returnProductObject } from './return-product.object';
import { PaginationDto, PaginationDtoBase } from 'src/utils/paganation.dto';
import { CreateProductDto } from './dto/product.dto';
import { slugify } from 'src/utils/gen.slug';
import { Prisma } from 'generated/prisma';


@Injectable()
export class ProductService {
    constructor(
        private readonly prismaService: PrismaService,
    ) {}

    public async getAll(p: PaginationDtoBase) {
        const { page, limit } = p;
        const skip = (page - 1) * limit;

        const [items, total] = await this.prismaService.$transaction([
            this.prismaService.product.findMany({orderBy: {createdAt: 'asc'}, take: limit, skip, select: returnProductObject}),
            this.prismaService.product.count()
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

    public async getBySlug(slug: string) {
        const product = await this.prismaService.product.findUnique({
            where: { slug },
            select: returnProductObject,
        });

        if (!product) throw new NotFoundException('Product not found');

        return product;
    }

    public async getAllByCategorySlug(paganation: PaginationDto, categorySlug: string) {
        const { cursor, limit } = paganation;
        const baseWhere = { category: { slug: categorySlug } };
        
        const query: Parameters<typeof this.prismaService.product.findMany>[0] = {
            where: baseWhere,
            take: limit + 1,
            orderBy: { id: 'asc' },
            select: {...returnProductObject}
        };

        if (cursor) {
            query.cursor = { id: cursor };
            query.skip = 1
        };

        const rows = await this.prismaService.product.findMany(query);

        const hasNext = rows.length > limit;

        if (hasNext) rows.pop();

        return {
            rows,
            meta: {
                nextCursor: hasNext ? rows[rows.length - 1].id : null,
                limit
            },
        };
    }

    public async create(dto: CreateProductDto) {
        const product = await this.prismaService.product.findUnique({
            where: { name: dto.name },
            select: { name: true },
        });

        if (product) throw new ConflictException('Product name already exists');

        let newProduct;
        try {
            newProduct = await this.prismaService.product.create({
                data: {
                    name: dto.name,
                    description: dto.description,
                    image: dto.image,
                    price: dto.price,
                    slug: slugify(dto.name),
                    category: {
                        connect: {
                            id: dto.categoryId
                        }
                    }
                }
            });
        } catch (error: any) {
            if (error.code === 'P2025') throw new NotFoundException('Product not found', {cause: error});

            if (error.code === 'P2002') throw new ConflictException('Product name already exists', {cause: error});

            throw error;
        }
    }

    public async search(p: PaginationDtoBase, searchTerm: string) {
        const { page, limit } = p;
        const skip = (page - 1) * limit
        const term = searchTerm.trim()
        const where: Prisma.ProductWhereInput = term ? {
            OR: [
                { name: { contains: searchTerm, mode: 'insensitive' } },
                { description: { contains: searchTerm, mode: 'insensitive' } },
            ],
        } : {};

        const [items, total] = await this.prismaService.$transaction([
            this.prismaService.product.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
                select: returnProductObject,
            }),
            this.prismaService.product.count({ where })
        ]);

        return {
            items,
            meta: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
                hasPrev: page > 1,
                hasNext: skip + items.length < length,
            },
        };
    }
}
