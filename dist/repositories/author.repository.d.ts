import type { Author, Prisma, PrismaClient, Book } from "../generated/client";
export interface IAuthorRepository {
    list(skip: number, limit: number, where: Prisma.AuthorWhereInput, orderBy: Prisma.AuthorOrderByWithRelationInput): Promise<Author[]>;
    countAll(where: Prisma.AuthorWhereInput): Promise<number>;
    findById(id: string): Promise<(Author & {
        books: Book[];
    }) | null>;
    findByName(name: string): Promise<Author | null>;
    create(data: Prisma.AuthorCreateInput): Promise<Author>;
    update(id: string, data: Prisma.AuthorUpdateInput): Promise<Author>;
    delete(id: string): Promise<Author>;
    getAuthorStats(): Promise<any>;
}
export declare class AuthorRepository implements IAuthorRepository {
    private prisma;
    constructor(prisma: PrismaClient);
    list(skip: number, limit: number, where: Prisma.AuthorWhereInput, orderBy: Prisma.AuthorOrderByWithRelationInput): Promise<Author[]>;
    countAll(where: Prisma.AuthorWhereInput): Promise<number>;
    findById(id: string): Promise<(Author & {
        books: Book[];
    }) | null>;
    findByName(name: string): Promise<Author | null>;
    create(data: Prisma.AuthorCreateInput): Promise<Author>;
    update(id: string, data: Prisma.AuthorUpdateInput): Promise<Author>;
    delete(id: string): Promise<Author>;
    /**
     * Analytics: Mendapatkan penulis yang paling banyak memiliki koleksi buku
     */
    getAuthorStats(): Promise<{
        name: string;
        _count: {
            books: number;
        };
    }[]>;
}
//# sourceMappingURL=author.repository.d.ts.map