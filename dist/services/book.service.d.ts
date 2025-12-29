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
export declare class BookService implements IBookService {
    private bookRepo;
    constructor(bookRepo: IBookRepository);
    list(params: FindAllBooksParams): Promise<BookListResponse>;
    getById(id: string): Promise<Book>;
    create(data: Prisma.BookCreateInput): Promise<Book>;
    update(id: string, data: Prisma.BookUpdateInput): Promise<Book>;
    delete(id: string): Promise<Book>;
    getDashboardStats(): Promise<{
        totalAvailableBooks: number;
        activeTransactions: number;
        popularBook: any;
    }>;
}
export {};
//# sourceMappingURL=book.service.d.ts.map