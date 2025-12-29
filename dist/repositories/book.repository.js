export class BookRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(skip, take, where, orderBy) {
        return await this.prisma.book.findMany({
            skip,
            take,
            where: {
                ...where,
                deletedAt: null // Selalu filter yang belum dihapus
            },
            orderBy,
            include: {
                category: true,
                author: true
            }
        });
    }
    async countAll(where) {
        return await this.prisma.book.count({
            where: { ...where, deletedAt: null }
        });
    }
    async findById(id) {
        return await this.prisma.book.findUnique({
            where: { id, deletedAt: null },
            include: { category: true, author: true }
        });
    }
    async create(data) {
        return await this.prisma.book.create({ data });
    }
    async update(id, data) {
        return await this.prisma.book.update({
            where: { id },
            data
        });
    }
    async softDelete(id) {
        return await this.prisma.book.update({
            where: { id },
            data: { deletedAt: new Date() }
        });
    }
    /**
     * Implementasi GET /admin/stats
     */
    async getAdminStats() {
        // 1. Total buku yang tersedia (Sum dari kolom stock)
        const totalStock = await this.prisma.book.aggregate({
            _sum: { stock: true },
            where: { deletedAt: null }
        });
        // 2. Total transaksi peminjaman aktif (Status BORROWED)
        const activeTransactions = await this.prisma.transaction.count({
            where: { status: 'BORROWED' }
        });
        // 3. Buku paling populer (Paling banyak muncul di TransactionItem)
        const popularBooks = await this.prisma.transactionItem.groupBy({
            by: ['bookId'],
            _count: { bookId: true },
            orderBy: {
                _count: { bookId: 'desc' }
            },
            take: 1
        });
        let popularBookTitle = "N/A";
        // Pastikan popularBooks ada isinya sebelum mengambil ID
        const topRecord = popularBooks[0];
        if (topRecord?.bookId) {
            const book = await this.prisma.book.findUnique({
                where: { id: topRecord.bookId },
                select: { title: true }
            });
            if (book)
                popularBookTitle = book.title;
        }
        return {
            totalAvailableBooks: totalStock._sum.stock || 0,
            activeTransactions: activeTransactions,
            popularBook: popularBookTitle
        };
    }
}
//# sourceMappingURL=book.repository.js.map