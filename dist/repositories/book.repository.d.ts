import type { Prisma, PrismaClient, Book } from "../generated/client";
export interface IBookRepository {
    list(skip: number, take: number, where: Prisma.BookWhereInput, orderBy: Prisma.BookOrderByWithRelationInput): Promise<Book[]>;
    countAll(where: Prisma.BookWhereInput): Promise<number>;
    findById(id: string): Promise<Book | null>;
    create(data: Prisma.BookCreateInput): Promise<Book>;
    update(id: string, data: Prisma.BookUpdateInput): Promise<Book>;
    softDelete(id: string): Promise<Book>;
    getAdminStats(): Promise<{
        totalAvailableBooks: number;
        activeTransactions: number;
        popularBook: any;
    }>;
}
export declare class BookRepository implements IBookRepository {
    private prisma;
    constructor(prisma: PrismaClient);
    list(skip: number, take: number, where: Prisma.BookWhereInput, orderBy: Prisma.BookOrderByWithRelationInput): Promise<Book[]>;
    countAll(where: Prisma.BookWhereInput): Promise<number>;
    findById(id: string): Promise<Book | null>;
    create(data: Prisma.BookCreateInput): Promise<Book>;
    update(id: string, data: Prisma.BookUpdateInput): Promise<Book>;
    softDelete(id: string): Promise<Book>;
    /**
     * Implementasi GET /admin/stats
     */
    getAdminStats(): Promise<{
        totalAvailableBooks: number;
        activeTransactions: number;
        popularBook: string;
    }>;
}
//# sourceMappingURL=book.repository.d.ts.map