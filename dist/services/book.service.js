export class BookService {
    bookRepo;
    constructor(bookRepo) {
        this.bookRepo = bookRepo;
    }
    async list(params) {
        const { page, limit, search, sortBy, sortOrder } = params;
        const skip = (page - 1) * limit;
        // Filter dasar untuk Soft Delete
        const whereClause = { deletedAt: null };
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
        const sortCriteria = sortBy
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
    async getById(id) {
        const book = await this.bookRepo.findById(id);
        if (!book) {
            throw new Error("Buku tidak ditemukan atau sudah dihapus");
        }
        return book;
    }
    async create(data) {
        // Kamu bisa menambahkan validasi ISBN unik di sini sebelum create
        return await this.bookRepo.create(data);
    }
    async update(id, data) {
        // Pastikan buku ada sebelum diupdate
        await this.getById(id);
        return await this.bookRepo.update(id, data);
    }
    async delete(id) {
        // Pastikan buku ada sebelum didelete
        await this.getById(id);
        return await this.bookRepo.softDelete(id);
    }
    async getDashboardStats() {
        // Memanggil method khusus analytics yang sudah kamu buat di repository
        return await this.bookRepo.getAdminStats();
    }
}
//# sourceMappingURL=book.service.js.map