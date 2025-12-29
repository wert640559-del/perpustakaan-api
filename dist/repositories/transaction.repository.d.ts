import type { Prisma, PrismaClient, Transaction, TransactionItem } from "../generated/client.js";
export interface ITransactionRepository {
    list(skip: number, take: number, where: Prisma.TransactionWhereInput, orderBy: Prisma.TransactionOrderByWithRelationInput): Promise<Transaction[]>;
    countAll(where: Prisma.TransactionWhereInput): Promise<number>;
    findById(id: string): Promise<(Transaction & {
        items: TransactionItem[];
    }) | null>;
    create(data: Prisma.TransactionCreateInput): Promise<Transaction>;
    update(id: string, data: Prisma.TransactionUpdateInput): Promise<Transaction>;
    getStats(): Promise<Prisma.GetTransactionAggregateType<{
        _count: {
            id: true;
        };
    }>>;
}
export declare class TransactionRepository implements ITransactionRepository {
    private prisma;
    constructor(prisma: PrismaClient);
    countAll(where: Prisma.TransactionWhereInput): Promise<number>;
    list(skip: number, take: number, where: Prisma.TransactionWhereInput, orderBy: Prisma.TransactionOrderByWithRelationInput): Promise<Transaction[]>;
    findById(id: string): Promise<(Transaction & {
        items: TransactionItem[];
    }) | null>;
    create(data: Prisma.TransactionCreateInput): Promise<Transaction>;
    update(id: string, data: Prisma.TransactionUpdateInput): Promise<Transaction>;
    softDelete(id: string): Promise<Transaction>;
    getStats(): Promise<Prisma.GetTransactionAggregateType<{
        _count: {
            id: true;
        };
    }>>;
}
//# sourceMappingURL=transaction.repository.d.ts.map
