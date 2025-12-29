import type { Category, Prisma, PrismaClient, Book } from "../generated/client";

export interface ICategoryRepository {
    list(
        skip: number,
        take: number,
        where: Prisma.CategoryWhereInput,
        orderBy: Prisma.CategoryOrderByWithRelationInput
    ): Promise<Category[]>;
    
    countAll(where: Prisma.CategoryWhereInput): Promise<number>;
    
    findById(id: string): Promise<(Category & { books: Book[] }) | null>;
    
    create(data: Prisma.CategoryCreateInput): Promise<Category>;
    
    update(id: string, data: Prisma.CategoryUpdateInput): Promise<Category>;
    
    // Sesuai pola repo Anda, jika ingin soft delete pastikan ada deletedAt di schema
    delete(id: string): Promise<Category>;

    // Statistik: Menghitung jumlah buku di setiap kategori
    getCategoryBookStats(): Promise<(Prisma.PickEnumerable<Prisma.BookGroupByOutputType, "categoryId"[]> & {
        _count: {
            id: number;
        };
    })[]>;
}

export class CategoryRepository implements ICategoryRepository {
    constructor(private prisma: PrismaClient) { }

    async list(
        skip: number,
        take: number,
        where: Prisma.CategoryWhereInput,
        orderBy: Prisma.CategoryOrderByWithRelationInput
    ): Promise<Category[]> {
        return await this.prisma.category.findMany({
            skip,
            take,
            where,
            orderBy,
            include: {
                _count: {
                    select: { books: true }
                }
            }
        });
    }

    async countAll(where: Prisma.CategoryWhereInput): Promise<number> {
        return await this.prisma.category.count({ where });
    }

    async findById(id: string): Promise<(Category & { books: Book[] }) | null> {
        return await this.prisma.category.findUnique({
            where: { id },
            include: {
                books: {
                    where: { deletedAt: null } // Hanya buku yang belum di-soft delete
                }
            }
        }) as (Category & { books: Book[] }) | null;
    }

    async create(data: Prisma.CategoryCreateInput): Promise<Category> {
        return await this.prisma.category.create({ data });
    }

    async update(id: string, data: Prisma.CategoryUpdateInput): Promise<Category> {
        return await this.prisma.category.update({
            where: { id },
            data
        });
    }

    async delete(id: string): Promise<Category> {
        // Karena di skema Category Anda belum ada deletedAt, 
        // ini menggunakan delete permanen.
        return await this.prisma.category.delete({
            where: { id }
        });
    }

    /**
     * Implementasi Analytics:
     * Menghitung jumlah buku per kategori (Mirip fungsi di ProductRepo Anda)
     */
    async getCategoryBookStats() {
        return await this.prisma.book.groupBy({
            by: ['categoryId'],
            where: { deletedAt: null },
            _count: {
                id: true
            }
        });
    }
}