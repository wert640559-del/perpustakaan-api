export class AuthorService {
    authorRepo;
    constructor(authorRepo) {
        this.authorRepo = authorRepo;
    }
    async list(params) {
        const { page, limit, search, sortBy, sortOrder } = params;
        const skip = (page - 1) * limit;
        console.log(`AuthorService.list called with:`, { page, limit, skip, search, sortBy, sortOrder });
        const whereClause = {};
        if (search?.name) {
            whereClause.name = { contains: search.name, mode: 'insensitive' };
        }
        const sortCriteria = sortBy
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
    async getById(id) {
        console.log(`Fetching author by ID: ${id}`);
        const author = await this.authorRepo.findById(id);
        if (!author) {
            throw new Error("Penulis tidak ditemukan");
        }
        return author;
    }
    async create(data) {
        console.log(`Creating author: ${data.name}`);
        const existingAuthor = await this.authorRepo.findByName(data.name);
        if (existingAuthor) {
            throw new Error("Nama penulis sudah terdaftar");
        }
        return await this.authorRepo.create(data);
    }
    async update(id, data) {
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
    async delete(id) {
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
//# sourceMappingURL=author.service.js.map