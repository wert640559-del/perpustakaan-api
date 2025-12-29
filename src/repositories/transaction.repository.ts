import type { Prisma, PrismaClient, Transaction, TransactionItem } from "../generated/client";

export interface ITransactionRepository {
    list(
        skip: number,
        take: number,
        where: Prisma.TransactionWhereInput,
        orderBy: Prisma.TransactionOrderByWithRelationInput
    ): Promise<Transaction[]>;
    
    countAll(where: Prisma.TransactionWhereInput): Promise<number>;

    findById(id: string): Promise<(Transaction & { items: TransactionItem[] }) | null>;
    
    create(data: Prisma.TransactionCreateInput): Promise<Transaction>;
    
    update(id: string, data: Prisma.TransactionUpdateInput): Promise<Transaction>;
    
    // Khusus Perpustakaan: Status Analytics
    getStats(): Promise<Prisma.GetTransactionAggregateType<{
        _count: { id: true };
    }>>;
}

export class TransactionRepository implements ITransactionRepository {
    constructor(private prisma: PrismaClient) { }

    async countAll(where: Prisma.TransactionWhereInput): Promise<number> {
        return await this.prisma.transaction.count({ 
            where
        });
    }

    async list(
        skip: number,
        take: number,
        where: Prisma.TransactionWhereInput,
        orderBy: Prisma.TransactionOrderByWithRelationInput
    ): Promise<Transaction[]> {
        return await this.prisma.transaction.findMany({
            skip,
            take,
            where,
            orderBy,
            include: {
                member: true, 
                _count: { select: { items: true } }
            }
        });
    }

    async findById(id: string): Promise<(Transaction & { items: TransactionItem[] }) | null> {
        return await this.prisma.transaction.findUnique({
            where: { id },
            include: {
                member: true,
                items: {
                    include: {
                        book: true 
                    }
                }
            }
        }) as (Transaction & { items: TransactionItem[] }) | null;
    }

    async create(data: Prisma.TransactionCreateInput): Promise<Transaction> {
        return await this.prisma.transaction.create({
            data,
            include: {
                items: true
            }
        });
    }

    async update(id: string, data: Prisma.TransactionUpdateInput): Promise<Transaction> {
        return await this.prisma.transaction.update({
            where: { id },
            data,
            include: {
                items: true
            }
        });
    }

    async softDelete(id: string): Promise<Transaction> {
        return await this.prisma.transaction.update({
            where: { id },
            data: {
                status: 'CANCELLED'
            }
        });
    }

    async getStats() {
        return await this.prisma.transaction.aggregate({
            _count: { id: true },
        });
    }
}