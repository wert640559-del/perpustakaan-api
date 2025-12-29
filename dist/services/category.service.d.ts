import type { Category, Prisma, Book } from "../generated/client";
import type { ICategoryRepository } from "../repositories/category.repository";
interface FindAllCategoriesParams {
    page: number;
    limit: number;
    search?: {
        name?: string;
    };
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
interface CategoryListResponse {
    categories: Category[];
    total: number;
    totalPages: number;
    currentPage: number;
}
export interface ICategoryService {
    list(params: FindAllCategoriesParams): Promise<CategoryListResponse>;
    getById(id: string): Promise<Category & {
        books: Book[];
    }>;
    create(data: Prisma.CategoryCreateInput): Promise<Category>;
    update(id: string, data: Prisma.CategoryUpdateInput): Promise<Category>;
    delete(id: string): Promise<Category>;
    getStats(): Promise<any>;
}
export declare class CategoryService implements ICategoryService {
    private categoryRepo;
    constructor(categoryRepo: ICategoryRepository);
    list(params: FindAllCategoriesParams): Promise<CategoryListResponse>;
    getById(id: string): Promise<Category & {
        books: Book[];
    }>;
    create(data: Prisma.CategoryCreateInput): Promise<Category>;
    update(id: string, data: Prisma.CategoryUpdateInput): Promise<Category>;
    delete(id: string): Promise<Category>;
    /**
     * Mengikuti pola exec() di ProductService Anda
     */
    getStats(): Promise<{
        categoryName: string;
        totalBooks: number;
    }[]>;
}
export {};
//# sourceMappingURL=category.service.d.ts.map