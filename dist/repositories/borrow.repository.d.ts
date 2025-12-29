import type { Prisma } from "../generated/client.js";
export declare function findBookStock(bookId: number): Promise<any>;
export declare function createBorrow(tx: Prisma.TransactionClient, userId: number): Promise<any>;
export declare function createBorrowItem(tx: Prisma.TransactionClient, borrowId: number, bookId: number, quantity: number): Promise<any>;
export declare function decreaseBookStock(tx: Prisma.TransactionClient, bookId: number, quantity: number): Promise<any>;
export declare function increaseBookStock(tx: Prisma.TransactionClient, bookId: number, quantity: number): Promise<any>;
export declare function list(skip: number, take: number, where: Prisma.BorrowWhereInput, orderBy: Prisma.BorrowOrderByWithRelationInput): Promise<any>;
export declare function countAll(where: Prisma.BorrowWhereInput): Promise<any>;
export declare function findById(id: number): Promise<any>;
export declare function update(id: number, data: Prisma.BorrowUpdateInput): Promise<any>;
export declare function transaction<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>): Promise<runtime.Types.Utils.JsPromise<R>>;
//# sourceMappingURL=borrow.repository.d.ts.map
