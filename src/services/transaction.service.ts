import type { Prisma, Transaction, TransactionItem, Book } from "../generated/client";
import type { ITransactionRepository } from "../repositories/transaction.repository";
import type { IBookRepository } from "../repositories/book.repository";

interface FindAllParams {
    page: number;
    limit: number;
    memberId?: string;
    status?: "BORROWED" | "RETURNED" | "OVERDUE" | "CANCELLED";
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

interface TransactionListResponse {
    transactions: Transaction[];
    total: number;
    totalPages: number;
    currentPage: number;
}

export interface ITransactionService {
    list(params: FindAllParams): Promise<TransactionListResponse>;
    getById(id: string): Promise<Transaction & { items: TransactionItem[] }>;
    // Data input mirip dengan pola Order Anda (userId -> memberId)
    create(data: { memberId: string; items: { bookId: string; quantity: number }[]; dueDate: Date }): Promise<Transaction>;
    returnBooks(id: string): Promise<Transaction>;
    exec(): Promise<{ overview: any }>;
}

export class TransactionService implements ITransactionService {
    constructor(
        private transactionRepo: ITransactionRepository,
        private bookRepo: IBookRepository
    ) {}

    async list(params: FindAllParams): Promise<TransactionListResponse> {
        const { page, limit, memberId, status, sortBy, sortOrder } = params;
        const skip = (page - 1) * limit;

        const whereClause: Prisma.TransactionWhereInput = {};
        if (memberId) whereClause.memberId = memberId;
        if (status) whereClause.status = status;

        const sortCriteria: Prisma.TransactionOrderByWithRelationInput = sortBy
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

    async getById(id: string): Promise<Transaction & { items: TransactionItem[] }> {
        const transaction = await this.transactionRepo.findById(id);
        if (!transaction) throw new Error("Transaksi tidak ditemukan");
        return transaction;
    }

    /**
     * Mengikuti pola Create Order Anda:
     * 1. Cek ketersediaan buku (stock)
     * 2. Kurangi stok buku
     * 3. Simpan transaksi peminjaman
     */
    async create(data: { memberId: string; items: { bookId: string; quantity: number }[]; dueDate: Date }): Promise<Transaction> {
        // 1. Validasi stok buku
        for (const item of data.items) {
            const bookData = await this.bookRepo.findById(item.bookId);
            if (!bookData) {
                throw new Error(`Buku dengan ID ${item.bookId} tidak ditemukan`);
            }

            const book = bookData as unknown as Book;

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
    async returnBooks(id: string): Promise<Transaction> {
        const transaction = await this.getById(id);

        if (transaction.status === 'RETURNED') {
            throw new Error("Buku dalam transaksi ini sudah dikembalikan");
        }

        // Update stok: Kembalikan buku ke rak (tambah stok)
        for (const item of transaction.items) {
            const book = await this.bookRepo.findById(item.bookId);
            if (book) {
                await this.bookRepo.update(item.bookId, {
                    stock: (book as unknown as Book).stock + item.quantity
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