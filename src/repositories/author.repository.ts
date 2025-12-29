import type { Author, Prisma, PrismaClient, Book } from "../generated/client";

export interface IAuthorRepository {
    list(
        skip: number,
        limit: number,
        where: Prisma.AuthorWhereInput,
        orderBy: Prisma.AuthorOrderByWithRelationInput
    ): Promise<Author[]>;
    
    countAll(where: Prisma.AuthorWhereInput): Promise<number>;
    
    findById(id: string): Promise<(Author & { books: Book[] }) | null>;
    
    findByName(name: string): Promise<Author | null>;
    
    create(data: Prisma.AuthorCreateInput): Promise<Author>;
    
    update(id: string, data: Prisma.AuthorUpdateInput): Promise<Author>;
    
    delete(id: string): Promise<Author>;

    // Statistik: Penulis dengan produktivitas buku tertinggi
    getAuthorStats(): Promise<any>;
}

export class AuthorRepository implements IAuthorRepository {
    constructor(private prisma: PrismaClient) { }

    async list(
        skip: number,
        limit: number,
        where: Prisma.AuthorWhereInput,
        orderBy: Prisma.AuthorOrderByWithRelationInput
    ): Promise<Author[]> {
        return await this.prisma.author.findMany({
            skip,
            take: limit,
            where,
            orderBy,
            include: {
                _count: {
                    select: { books: true }
                }
            }
        });
    }

    async countAll(where: Prisma.AuthorWhereInput): Promise<number> {
        return await this.prisma.author.count({ where });
    }

    async findById(id: string): Promise<(Author & { books: Book[] }) | null> {
        return await this.prisma.author.findUnique({
            where: { id },
            include: {
                books: {
                    where: { deletedAt: null },
                    include: { category: true }
                }
            }
        }) as (Author & { books: Book[] }) | null;
    }

    async findByName(name: string): Promise<Author | null> {
        return await this.prisma.author.findUnique({
            where: { name }
        });
    }

    async create(data: Prisma.AuthorCreateInput): Promise<Author> {
        return await this.prisma.author.create({ data });
    }

    async update(id: string, data: Prisma.AuthorUpdateInput): Promise<Author> {
        return await this.prisma.author.update({
            where: { id },
            data
        });
    }

    async delete(id: string): Promise<Author> {
        // Note: Skema Anda menggunakan onDelete: Cascade pada relasi Book.
        // Menghapus Author akan menghapus semua buku terkait!
        return await this.prisma.author.delete({
            where: { id }
        });
    }

    /**
     * Analytics: Mendapatkan penulis yang paling banyak memiliki koleksi buku
     */
    async getAuthorStats() {
        return await this.prisma.author.findMany({
            select: {
                name: true,
                _count: {
                    select: { books: true }
                }
            },
            orderBy: {
                books: {
                    _count: 'desc'
                }
            },
            take: 5
        });
    }
}