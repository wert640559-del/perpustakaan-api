import { getPrisma } from "../prisma";
const prisma = getPrisma();
export async function findBookStock(bookId) {
    return await prisma.book.findUnique({
        where: { id: bookId, deletedAt: null },
        select: { id: true, title: true, stock: true }
    });
}
export async function createBorrow(tx, userId) {
    return await tx.borrow.create({
        data: {
            userId,
            status: "BORROWED",
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
    });
}
export async function createBorrowItem(tx, borrowId, bookId, quantity) {
    return await tx.borrowItem.create({
        data: {
            borrowId,
            bookId,
            quantity
        }
    });
}
export async function decreaseBookStock(tx, bookId, quantity) {
    return await tx.book.update({
        where: { id: bookId },
        data: {
            stock: { decrement: quantity }
        }
    });
}
export async function increaseBookStock(tx, bookId, quantity) {
    return await tx.book.update({
        where: { id: bookId },
        data: {
            stock: { increment: quantity }
        }
    });
}
export async function list(skip, take, where, orderBy) {
    return await prisma.borrow.findMany({
        skip,
        take,
        where,
        orderBy,
        include: {
            user: true,
            borrowItems: {
                include: { book: true }
            }
        }
    });
}
export async function countAll(where) {
    return await prisma.borrow.count({ where });
}
export async function findById(id) {
    return await prisma.borrow.findFirst({
        where: { id, deletedAt: null },
        include: {
            user: true,
            borrowItems: {
                include: { book: true }
            }
        }
    });
}
export async function update(id, data) {
    return await prisma.borrow.update({
        where: { id },
        data
    });
}
export async function transaction(fn) {
    return await prisma.$transaction(fn);
}
//# sourceMappingURL=borrow.repository.js.map