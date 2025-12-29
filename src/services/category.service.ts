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
    getById(id: string): Promise<Category & { books: Book[] }>;
    create(data: Prisma.CategoryCreateInput): Promise<Category>;
    update(id: string, data: Prisma.CategoryUpdateInput): Promise<Category>;
    delete(id: string): Promise<Category>;
    getStats(): Promise<any>;
}

export class CategoryService implements ICategoryService {
    constructor(private categoryRepo: ICategoryRepository) {}

    async list(params: FindAllCategoriesParams): Promise<CategoryListResponse> {
        const { page, limit, search, sortBy, sortOrder } = params;
        const skip = (page - 1) * limit;

        const whereClause: Prisma.CategoryWhereInput = {};

        if (search?.name) {
            whereClause.name = { contains: search.name, mode: 'insensitive' };
        }

        const sortCriteria: Prisma.CategoryOrderByWithRelationInput = sortBy
            ? { [sortBy]: sortOrder || 'desc' }
            : { createdAt: 'desc' };

        const categories = await this.categoryRepo.list(skip, limit, whereClause, sortCriteria);
        const total = await this.categoryRepo.countAll(whereClause);

        return {
            categories,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        };
    }

    async getById(id: string): Promise<Category & { books: Book[] }> {
        const category = await this.categoryRepo.findById(id);
        if (!category) {
            throw new Error("Kategori tidak ditemukan");
        }
        return category;
    }

    async create(data: Prisma.CategoryCreateInput): Promise<Category> {
        // Nama kategori biasanya unik, Prisma akan melempar error jika duplikat
        // sesuai dengan atribut @unique di skema kamu.
        return await this.categoryRepo.create(data);
    }

    async update(id: string, data: Prisma.CategoryUpdateInput): Promise<Category> {
        await this.getById(id);
        return await this.categoryRepo.update(id, data);
    }

    async delete(id: string): Promise<Category> {
        const category = await this.getById(id);
        
        // Logic tambahan: Cegah hapus kategori jika masih ada buku di dalamnya
        if (category.books && category.books.length > 0) {
            throw new Error("Kategori tidak bisa dihapus karena masih memiliki buku aktif");
        }

        return await this.categoryRepo.delete(id);
    }

    /**
     * Mengikuti pola exec() di ProductService Anda
     */
    async getStats() {
        const bookCounts = await this.categoryRepo.getCategoryBookStats();
        
        // Kita bisa memperkaya data ini dengan mengambil nama kategori 
        // agar dashboard tidak hanya menampilkan ID
        const categories = await this.categoryRepo.list(0, 100, {}, {});

        return bookCounts.map(stat => {
            const categoryName = categories.find(c => c.id === stat.categoryId)?.name || "Unknown";
            return {
                categoryName,
                totalBooks: stat._count.id
            };
        });
    }
}