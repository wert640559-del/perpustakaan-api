import { successResponse } from "../utils/response";
export class TransactionController {
    transactionService;
    constructor(transactionService) {
        this.transactionService = transactionService;
        this.list = this.list.bind(this);
        this.getById = this.getById.bind(this);
        this.create = this.create.bind(this);
        this.returnBooks = this.returnBooks.bind(this);
        this.getStats = this.getStats.bind(this);
    }
    async list(req, res) {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const sortBy = req.query.sortBy;
        const sortOrder = req.query.sortOrder || 'desc';
        const memberId = req.query.memberId;
        const status = req.query.status;
        const result = await this.transactionService.list({
            page,
            limit,
            memberId,
            status,
            sortBy,
            sortOrder
        });
        const pagination = {
            page: result.currentPage,
            limit,
            total: result.total,
            totalPages: result.totalPages
        };
        successResponse(res, "Daftar transaksi berhasil diambil", result.transactions, pagination);
    }
    async getById(req, res) {
        const { id } = req.params;
        if (!id)
            throw new Error("ID transaksi diperlukan");
        const transaction = await this.transactionService.getById(id);
        successResponse(res, "Detail transaksi berhasil diambil", transaction);
    }
    async create(req, res) {
        const { memberId, items, dueDate } = req.body;
        if (!memberId || !items || !Array.isArray(items) || !dueDate) {
            throw new Error("Data memberId, items, dan dueDate wajib diisi");
        }
        const transaction = await this.transactionService.create({
            memberId: String(memberId),
            dueDate: new Date(dueDate),
            items: items.map((item) => ({
                bookId: String(item.bookId),
                quantity: Number(item.quantity)
            }))
        });
        successResponse(res, "Peminjaman buku berhasil dicatat", transaction, null, 201);
    }
    /**
     * Fitur khusus Library: Pengembalian Buku
     */
    async returnBooks(req, res) {
        const { id } = req.params;
        if (!id)
            throw new Error("ID transaksi diperlukan untuk pengembalian");
        const result = await this.transactionService.returnBooks(id);
        successResponse(res, "Buku berhasil dikembalikan", result);
    }
    async getStats(_req, res) {
        const stats = await this.transactionService.exec();
        successResponse(res, "Statistik transaksi berhasil diambil", stats);
    }
}
//# sourceMappingURL=transaction.controller.js.map