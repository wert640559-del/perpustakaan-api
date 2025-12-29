import type { Prisma, PrismaClient, Book } from "../generated/client";

export interface IBookRepository {
    list(
        skip: number,
        take: number,
        where: Prisma.BookWhereInput,
        orderBy: Prisma.BookOrderByWithRelationInput
    ): Promise<Book[]>;
    countAll(where: Prisma.BookWhereInput): Promise<number>;
    findById(id: string): Promise<Book | null>;
    create(data: Prisma.BookCreateInput): Promise<Book>;
    update(id: string, data: Prisma.BookUpdateInput): Promise<Book>;
    softDelete(id: string): Promise<Book>;
    
    // Method khusus untuk Analytics Tugas
    getAdminStats(): Promise<{
        totalAvailableBooks: number;
        activeTransactions: number;
        popularBook: any;
    }>;
}

export class BookRepository implements IBookRepository {
    constructor(private prisma: PrismaClient) { }

    async list(
        skip: number,
        take: number,
        where: Prisma.BookWhereInput,
        orderBy: Prisma.BookOrderByWithRelationInput
    ): Promise<Book[]> {
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

    async countAll(where: Prisma.BookWhereInput): Promise<number> {
        return await this.prisma.book.count({ 
            where: { ...where, deletedAt: null } 
        });
    }

    async findById(id: string): Promise<Book | null> {
        return await this.prisma.book.findUnique({
            where: { id, deletedAt: null },
            include: { category: true, author: true }
        });
    }

    async create(data: Prisma.BookCreateInput): Promise<Book> {
        return await this.prisma.book.create({ data });
    }

    async update(id: string, data: Prisma.BookUpdateInput): Promise<Book> {
        return await this.prisma.book.update({
            where: { id },
            data
        });
    }

    async softDelete(id: string): Promise<Book> {
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
          if (book) popularBookTitle = book.title;
      }

      return {
          totalAvailableBooks: totalStock._sum.stock || 0,
          activeTransactions: activeTransactions,
          popularBook: popularBookTitle
      };
    }
}