import { successResponse } from "../utils/response";
export class BookController {
    bookService;
    constructor(bookService) {
        this.bookService = bookService;
        // Binding methods agar 'this' tetap merujuk pada class saat dipanggil router
        this.list = this.list.bind(this);
        this.getById = this.getById.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.remove = this.remove.bind(this);
        this.getStats = this.getStats.bind(this);
    }
    async list(req, res) {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        // Parsing search params sesuai interface FindAllBooksParams
        const search = {
            title: req.query.title,
            authorId: req.query.authorId,
            categoryId: req.query.categoryId,
        };
        const sortBy = req.query.sortBy;
        const sortOrder = req.query.sortOrder || 'desc';
        const result = await this.bookService.list({
            page,
            limit,
            search,
            sortBy,
            sortOrder
        });
        const pagination = {
            page: result.currentPage,
            limit,
            total: result.total,
            totalPages: result.totalPages
        };
        successResponse(res, "Data buku berhasil diambil", result.books, pagination);
    }
    async getById(req, res) {
        const { id } = req.params;
        if (!id) {
            throw new Error("ID buku tidak ditemukan");
        }
        const book = await this.bookService.getById(id);
        successResponse(res, "Detail buku berhasil diambil", book);
    }
    async create(req, res) {
        const file = req.file;
        if (!file)
            throw new Error("Cover image is required");
        const { title, isbn, year, stock, authorId, categoryId, description } = req.body;
        const imageUrl = `/public/uploads/${file.filename}`;
        const data = {
            title: String(title),
            isbn: String(isbn),
            year: Number(year),
            stock: Number(stock),
            authorId: String(authorId),
            categoryId: String(categoryId),
            coverImage: imageUrl,
            ...(description && { description: String(description) }),
        };
        const book = await this.bookService.create(data);
        successResponse(res, "Buku berhasil ditambahkan", book, null, 201);
    }
    async update(req, res) {
        const { id } = req.params;
        // Gunakan default empty object {} agar tidak error "cannot destructure of undefined"
        const { title, isbn, year, stock, authorId, categoryId } = req.body || {};
        const updateData = {};
        if (title)
            updateData.title = title;
        if (isbn)
            updateData.isbn = isbn;
        if (year)
            updateData.year = Number(year);
        if (stock)
            updateData.stock = Number(stock);
        if (authorId)
            updateData.authorId = authorId;
        if (categoryId)
            updateData.categoryId = categoryId;
        if (req.file) {
            updateData.coverImage = `/public/uploads/${req.file.filename}`;
        }
        // Pastikan ada data yang diupdate sebelum panggil service
        if (Object.keys(updateData).length === 0) {
            throw new Error("Tidak ada data yang dikirim untuk diperbarui");
        }
        const updatedBook = await this.bookService.update(id, updateData);
        successResponse(res, "Buku berhasil diperbarui", updatedBook);
    }
    async remove(req, res) {
        const { id } = req.params;
        if (!id)
            throw new Error("ID buku diperlukan");
        const deletedBook = await this.bookService.delete(id);
        successResponse(res, "Buku berhasil dihapus", deletedBook);
    }
    async getStats(_req, res) {
        const stats = await this.bookService.getDashboardStats();
        successResponse(res, "Statistik dashboard berhasil diambil", stats);
    }
}
//# sourceMappingURL=book.controller.js.map