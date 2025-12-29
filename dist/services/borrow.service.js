import * as borrowRepo from "../repositories/borrow.repository";
export const borrow = async (userId, payload) => {
    const items = payload.data;
    if (!items || items.length === 0) {
        throw new Error("Item peminjaman tidak boleh kosong");
    }
    let total = 0;
    for (const item of items) {
        const book = await borrowRepo.findBookPrice(item.bookId);
        if (!book) {
            throw new Error(`Buku dengan id ${item.bookId} tidak ditemukan`);
        }
        total += Number(book.price) * item.quantity;
    }
    try {
        return await borrowRepo.transaction(async (tx) => {
            const borrow = await borrowRepo.createBorrow(tx, userId, total);
            for (const item of items) {
                await borrowRepo.createBorrowItem(tx, borrow.id, item.bookId, item.quantity);
            }
            return borrow;
        });
    }
    catch (error) {
        console.error(error);
        throw new Error("Gagal membuat peminjaman");
    }
};
export const getAllBorrows = async (params) => {
    const { page, limit, search, sortBy, sortOrder } = params;
    const skip = (page - 1) * limit;
    const whereClause = {
        deletedAt: null
    };
    if (search?.user_name) {
        whereClause.user = {
            name: { contains: search.user_name, mode: "insensitive" }
        };
    }
    if (search?.min_total || search?.max_total) {
        whereClause.total = {
            ...(search.min_total && { gte: search.min_total }),
            ...(search.max_total && { lte: search.max_total })
        };
    }
    const sortCriteria = sortBy
        ? { [sortBy]: sortOrder || "desc" }
        : { createdAt: "desc" };
    const borrows = await borrowRepo.list(skip, limit, whereClause, sortCriteria);
    const total = await borrowRepo.countAll(whereClause);
    return {
        borrows,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page
    };
};
export const getBorrowById = async (id) => {
    const numId = parseInt(id);
    const borrow = await borrowRepo.findById(numId);
    if (!borrow) {
        throw new Error("Peminjaman tidak ditemukan");
    }
    return borrow;
};
export const updateBorrowStatus = async (id, status) => {
    const numId = Number(id);
    await getBorrowById(id);
    return await borrowRepo.update(numId, {
        status
    });
};
export const cancelBorrow = async (id) => {
    const numId = Number(id);
    await getBorrowById(id);
    return await borrowRepo.update(numId, {
        status: "CANCELED",
        deletedAt: new Date()
    });
};
//# sourceMappingURL=borrow.service.js.map