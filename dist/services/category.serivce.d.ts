import type { Category } from "../generated/client";
interface FindAllParams {
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
export declare const getAllCategories: (params: FindAllParams) => Promise<CategoryListResponse>;
export declare const getCategoryById: (id: string) => Promise<Category>;
export declare const createCategory: (name: string) => Promise<Category>;
export declare const updateCategory: (id: string, data: Partial<Category>) => Promise<Category>;
export declare const deleteCategory: (id: string) => Promise<Category>;
export {};
//# sourceMappingURL=category.serivce.d.ts.map