import type { Category, Prisma, PrismaClient, Book } from "../generated/client";
export interface ICategoryRepository {
    list(skip: number, take: number, where: Prisma.CategoryWhereInput, orderBy: Prisma.CategoryOrderByWithRelationInput): Promise<Category[]>;
    countAll(where: Prisma.CategoryWhereInput): Promise<number>;
    findById(id: string): Promise<(Category & {
        books: Book[];
    }) | null>;
    create(data: Prisma.CategoryCreateInput): Promise<Category>;
    update(id: string, data: Prisma.CategoryUpdateInput): Promise<Category>;
    delete(id: string): Promise<Category>;
    getCategoryBookStats(): Promise<(Prisma.PickEnumerable<Prisma.BookGroupByOutputType, "categoryId"[]> & {
        _count: {
            id: number;
        };
    })[]>;
}
export declare class CategoryRepository implements ICategoryRepository {
    private prisma;
    constructor(prisma: PrismaClient);
    list(skip: number, take: number, where: Prisma.CategoryWhereInput, orderBy: Prisma.CategoryOrderByWithRelationInput): Promise<Category[]>;
    countAll(where: Prisma.CategoryWhereInput): Promise<number>;
    findById(id: string): Promise<(Category & {
        books: Book[];
    }) | null>;
    create(data: Prisma.CategoryCreateInput): Promise<Category>;
    update(id: string, data: Prisma.CategoryUpdateInput): Promise<Category>;
    delete(id: string): Promise<Category>;
    /**
     * Implementasi Analytics:
     * Menghitung jumlah buku per kategori (Mirip fungsi di ProductRepo Anda)
     */
    getCategoryBookStats(): Promise<(Prisma.PickEnumerable<Prisma.BookGroupByOutputType, "categoryId"[]> & {
        _count: {
            id: number;
        };
    })[]>;
}
//# sourceMappingURL=category.repository.d.ts.map