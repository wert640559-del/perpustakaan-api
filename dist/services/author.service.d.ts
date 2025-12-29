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
    getById(id: string): Promise<Author & {
        books: Book[];
    }>;
    create(data: Prisma.AuthorCreateInput): Promise<Author>;
    update(id: string, data: Prisma.AuthorUpdateInput): Promise<Author>;
    delete(id: string): Promise<Author>;
    getTopAuthors(): Promise<any>;
}
export declare class AuthorService implements IAuthorService {
    private authorRepo;
    constructor(authorRepo: IAuthorRepository);
    list(params: FindAllAuthorsParams): Promise<AuthorListResponse>;
    getById(id: string): Promise<Author & {
        books: Book[];
    }>;
    create(data: Prisma.AuthorCreateInput): Promise<Author>;
    update(id: string, data: Prisma.AuthorUpdateInput): Promise<Author>;
    delete(id: string): Promise<Author>;
    getTopAuthors(): Promise<any>;
}
export {};
//# sourceMappingURL=author.service.d.ts.map