import type { Prisma, Transaction, TransactionItem } from "../generated/client.js";
import type { ITransactionRepository } from "../repositories/transaction.repository.js";
import type { IBookRepository } from "../repositories/book.repository.js";
interface FindAllParams {
    page: number;
    limit: number;
    memberId?: string;
    status?: "BORROWED" | "RETURNED" | "OVERDUE" | "CANCELLED";
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}
interface TransactionListResponse {
    transactions: Transaction[];
    total: number;
    totalPages: number;
    currentPage: number;
}
export interface ITransactionService {
    list(params: FindAllParams): Promise<TransactionListResponse>;
    getById(id: string): Promise<Transaction & {
        items: TransactionItem[];
    }>;
    create(data: {
        memberId: string;
        items: {
            bookId: string;
            quantity: number;
        }[];
        dueDate: Date;
    }): Promise<Transaction>;
    returnBooks(id: string): Promise<Transaction>;
    exec(): Promise<{
        overview: any;
    }>;
}
export declare class TransactionService implements ITransactionService {
    private transactionRepo;
    private bookRepo;
    constructor(transactionRepo: ITransactionRepository, bookRepo: IBookRepository);
    list(params: FindAllParams): Promise<TransactionListResponse>;
    getById(id: string): Promise<Transaction & {
        items: TransactionItem[];
    }>;
    /**
     * Mengikuti pola Create Order Anda:
     * 1. Cek ketersediaan buku (stock)
     * 2. Kurangi stok buku
     * 3. Simpan transaksi peminjaman
     */
    create(data: {
        memberId: string;
        items: {
            bookId: string;
            quantity: number;
        }[];
        dueDate: Date;
    }): Promise<Transaction>;
    /**
     * Logika khusus Library: Mengembalikan buku
     * 1. Ubah status jadi RETURNED
     * 2. Tambahkan kembali stok buku yang dipinjam
     */
    returnBooks(id: string): Promise<Transaction>;
    exec(): Promise<{
        overview: Prisma.GetTransactionAggregateType<{
            _count: {
                id: true;
            };
        }>;
    }>;
}
export {};
//# sourceMappingURL=transaction.service.d.ts.map
