import type { Author, Prisma, Book } from "../generated/client";
import type { IAuthorRepository } from "../repositories/author.repository";

interface FindAllAuthorsParams {
    page: number;
    limit: number;
    search?: {
        name?: string;
    };
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

interface AuthorListResponse {
    authors: Author[];
    total: number;
    totalPages: number;
    currentPage: number;
}

export interface IAuthorService {
    list(params: FindAllAuthorsParams): Promise<AuthorListResponse>;
    getById(id: string): Promise<Author & { books: Book[] }>;
    create(data: Prisma.AuthorCreateInput): Promise<Author>;
    update(id: string, data: Prisma.AuthorUpdateInput): Promise<Author>;
    delete(id: string): Promise<Author>;
    getTopAuthors(): Promise<any>;
}

export class AuthorService implements IAuthorService {
    constructor(private authorRepo: IAuthorRepository) {}

    async list(params: FindAllAuthorsParams): Promise<AuthorListResponse> {
        const { page, limit, search, sortBy, sortOrder } = params;
        const skip = (page - 1) * limit;

        console.log(`AuthorService.list called with:`, { page, limit, skip, search, sortBy, sortOrder });

        const whereClause: Prisma.AuthorWhereInput = {};

        if (search?.name) {
            whereClause.name = { contains: search.name, mode: 'insensitive' };
        }

        const sortCriteria: Prisma.AuthorOrderByWithRelationInput = sortBy
            ? { [sortBy]: sortOrder || 'desc' }
            : { createdAt: 'desc' };

        console.log(`Fetching authors with where:`, whereClause);
        
        const authors = await this.authorRepo.list(skip, limit, whereClause, sortCriteria);
        console.log(`Found ${authors.length} authors`);
        
        const total = await this.authorRepo.countAll(whereClause);
        console.log(`Total authors: ${total}`);

        return {
            authors,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        };
    }

    async getById(id: string): Promise<Author & { books: Book[] }> {
        console.log(`Fetching author by ID: ${id}`);
        const author = await this.authorRepo.findById(id);
        if (!author) {
            throw new Error("Penulis tidak ditemukan");
        }
        return author;
    }

    async create(data: Prisma.AuthorCreateInput): Promise<Author> {
        console.log(`Creating author: ${data.name}`);
        const existingAuthor = await this.authorRepo.findByName(data.name);
        if (existingAuthor) {
            throw new Error("Nama penulis sudah terdaftar");
        }
        return await this.authorRepo.create(data);
    }

    async update(id: string, data: Prisma.AuthorUpdateInput): Promise<Author> {
        console.log(`Updating author ID: ${id}`);
        await this.getById(id);
        
        if (data.name && typeof data.name === 'string') {
            const existingAuthor = await this.authorRepo.findByName(data.name);
            if (existingAuthor && existingAuthor.id !== id) {
                throw new Error("Nama penulis sudah digunakan");
            }
        }

        return await this.authorRepo.update(id, data);
    }

    async delete(id: string): Promise<Author> {
        console.log(`Deleting author ID: ${id}`);
        const author = await this.getById(id);
        
        if (author.books && author.books.length > 0) {
            throw new Error(`Gagal menghapus: Penulis masih memiliki ${author.books.length} buku. Hapus atau pindahkan buku terlebih dahulu.`);
        }

        return await this.authorRepo.delete(id);
    }

    async getTopAuthors() {
        console.log(`Fetching top authors stats`);
        return await this.authorRepo.getAuthorStats();
    }
}