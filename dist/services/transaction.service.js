export class TransactionService {
    transactionRepo;
    bookRepo;
    constructor(transactionRepo, bookRepo) {
        this.transactionRepo = transactionRepo;
        this.bookRepo = bookRepo;
    }
    async list(params) {
        const { page, limit, memberId, status, sortBy, sortOrder } = params;
        const skip = (page - 1) * limit;
        const whereClause = {};
        if (memberId)
            whereClause.memberId = memberId;
        if (status)
            whereClause.status = status;
        const sortCriteria = sortBy
            ? { [sortBy]: sortOrder || 'desc' }
            : { createdAt: 'desc' };
        const transactions = await this.transactionRepo.list(skip, limit, whereClause, sortCriteria);
        const total = await this.transactionRepo.countAll(whereClause);
        return {
            transactions,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        };
    }
    async getById(id) {
        const transaction = await this.transactionRepo.findById(id);
        if (!transaction)
            throw new Error("Transaksi tidak ditemukan");
        return transaction;
    }
    /**
     * Mengikuti pola Create Order Anda:
     * 1. Cek ketersediaan buku (stock)
     * 2. Kurangi stok buku
     * 3. Simpan transaksi peminjaman
     */
    async create(data) {
        // 1. Validasi stok buku
        for (const item of data.items) {
            const bookData = await this.bookRepo.findById(item.bookId);
            if (!bookData) {
                throw new Error(`Buku dengan ID ${item.bookId} tidak ditemukan`);
            }
            const book = bookData;
            if (book.stock < item.quantity) {
                throw new Error(`Stok buku "${book.title}" tidak mencukupi (Tersedia: ${book.stock})`);
            }
            // 2. Kurangi stok buku
            await this.bookRepo.update(book.id, {
                stock: book.stock - item.quantity
            });
        }
        // 3. Simpan transaksi
        return await this.transactionRepo.create({
            member: { connect: { id: data.memberId } },
            status: 'BORROWED',
            dueDate: data.dueDate,
            items: {
                create: data.items.map(item => ({
                    quantity: item.quantity,
                    book: { connect: { id: item.bookId } }
                }))
            }
        });
    }
    /**
     * Logika khusus Library: Mengembalikan buku
     * 1. Ubah status jadi RETURNED
     * 2. Tambahkan kembali stok buku yang dipinjam
     */
    async returnBooks(id) {
        const transaction = await this.getById(id);
        if (transaction.status === 'RETURNED') {
            throw new Error("Buku dalam transaksi ini sudah dikembalikan");
        }
        // Update stok: Kembalikan buku ke rak (tambah stok)
        for (const item of transaction.items) {
            const book = await this.bookRepo.findById(item.bookId);
            if (book) {
                await this.bookRepo.update(item.bookId, {
                    stock: book.stock + item.quantity
                });
            }
        }
        // Update status transaksi
        return await this.transactionRepo.update(id, {
            status: 'RETURNED',
            returnDate: new Date()
        });
    }
    async exec() {
        const stats = await this.transactionRepo.getStats();
        return { overview: stats };
    }
}
//# sourceMappingURL=transaction.service.js.map