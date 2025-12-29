import type { Prisma, Book } from "../generated/client";
import type { IBookRepository } from "../repositories/book.repository";

interface FindAllBooksParams {
    page: number;
    limit: number;
    search?: { 
        title?: string;
        authorId?: string;
        categoryId?: string;
    };
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

interface BookListResponse {
    books: Book[]; 
    total: number; 
    totalPages: number; 
    currentPage: number;
}

export interface IBookService {
    list(params: FindAllBooksParams): Promise<BookListResponse>;
    getById(id: string): Promise<Book>;
    create(data: Prisma.BookCreateInput): Promise<Book>;
    update(id: string, data: Prisma.BookUpdateInput): Promise<Book>;
    delete(id: string): Promise<Book>;
    getDashboardStats(): Promise<{
        totalAvailableBooks: number;
        activeTransactions: number;
        popularBook: string;
    }>;
}

export class BookService implements IBookService {
    constructor(private bookRepo: IBookRepository) {}

    async list(params: FindAllBooksParams): Promise<BookListResponse> {
        const { page, limit, search, sortBy, sortOrder } = params;

        const skip = (page - 1) * limit;

        // Filter dasar untuk Soft Delete
        const whereClause: Prisma.BookWhereInput = { deletedAt: null };

        // Pencarian spesifik Buku
        if (search?.title) {
            whereClause.title = { contains: search.title, mode: 'insensitive' };
        }
        if (search?.authorId) {
            whereClause.authorId = search.authorId;
        }
        if (search?.categoryId) {
            whereClause.categoryId = search.categoryId;
        }

        const sortCriteria: Prisma.BookOrderByWithRelationInput = sortBy
            ? { [sortBy]: sortOrder || 'desc' } 
            : { createdAt: 'desc' };

        const books = await this.bookRepo.list(skip, limit, whereClause, sortCriteria);
        const total = await this.bookRepo.countAll(whereClause);

        return { 
            books, 
            total, 
            totalPages: Math.ceil(total / limit), 
            currentPage: page 
        };
    }

    async getById(id: string): Promise<Book> {
        const book = await this.bookRepo.findById(id);

        if (!book) {
            throw new Error("Buku tidak ditemukan atau sudah dihapus");
        }

        return book;
    }

    async create(data: Prisma.BookCreateInput): Promise<Book> {
        // Kamu bisa menambahkan validasi ISBN unik di sini sebelum create
        return await this.bookRepo.create(data);
    }

    async update(id: string, data: Prisma.BookUpdateInput): Promise<Book> {
        // Pastikan buku ada sebelum diupdate
        await this.getById(id);
        return await this.bookRepo.update(id, data);
    }

    async delete(id: string): Promise<Book> {
        // Pastikan buku ada sebelum didelete
        await this.getById(id);
        return await this.bookRepo.softDelete(id);
    }

    async getDashboardStats() {
        // Memanggil method khusus analytics yang sudah kamu buat di repository
        return await this.bookRepo.getAdminStats();
    }
}