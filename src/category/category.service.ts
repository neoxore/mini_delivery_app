import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { returnCategoryObject } from './return-category.object';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { slugify } from 'src/utils/gen.slug';

@Injectable()
export class CategoryService {
    constructor(private readonly prismaService: PrismaService) {}

    public async getAll() {
        return await this.prismaService.category.findMany({
            select: returnCategoryObject
        });
    }

    public async getById(id: string) {
        const category = await this.prismaService.category.findUnique({
            where: { id },
            select: returnCategoryObject
        });

        if (!category) throw new NotFoundException('Category not found');

        return category;
    }

    public async getBySlug(slug: string) {
        const category = await this.prismaService.category.findUnique({
            where: { slug },
            select: returnCategoryObject
        });

        if (!category) throw new NotFoundException('Category not found');

        return category;
    }

    public async deleteById(id: string) {
    }

    public async create(dto: CreateCategoryDto) {
        const categoryName = await this.prismaService.category.findUnique({
            where: { name: dto.name },
            select: { name: true },
        })

        if (categoryName) throw new ConflictException('Category name already exists');

        const categoryNew = await this.prismaService.category.create({
            data: { ...dto, slug: slugify(dto.name)}
        })
    }

    public async update(id: string, dto: UpdateCategoryDto) {
        const data = {
            ...(dto.name ? { name: dto.name.trim() } : {}),
            ...(dto.image ? { image: dto.image.trim() } : {}),
        }

        if (Object.keys(data).length === 0) {
            return await this.prismaService.category.findUniqueOrThrow({
                where: { id }, 
                select: { id: true, name: true, slug: true, image: true },
            });
        }

        try {
            return await this.prismaService.category.update({
                where: { id },
                data,
                select: { id: true, name: true, image: true, updatedAt: true },
            })
        } catch (error: any) {
            if (error.code === 'P2025') throw new NotFoundException('Category not found', {cause: error});

            if (error.code === 'P2002') throw new ConflictException('Category name already exists', {cause: error});

            throw error;
        }
    }

}
