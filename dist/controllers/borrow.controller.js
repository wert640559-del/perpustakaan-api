import { successResponse } from "../utils/response.js";
import { borrow as checkoutBorrow, getAllBorrows, getBorrowById, updateBorrowStatus } from "../services/borrow.service.js";
export const getAll = async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search;
    const sortBy = req.query.sortBy;
    const sortOrder = req.query.sortOrder || "desc";
    const result = await getAllBorrows({
        page,
        limit,
        search,
        sortBy,
        sortOrder
    });
    const pagination = {
        page: result.currentPage,
        limit,
        total: result.total,
        totalPages: result.totalPages
    };
    successResponse(res, "Peminjaman berhasil diambil", result.borrows, pagination);
};
export const getById = async (req, res) => {
    if (!req.params.id) {
        throw new Error("Param id tidak ada");
    }
    const borrow = await getBorrowById(req.params.id);
    successResponse(res, "Peminjaman berhasil diambil", borrow);
};
export const checkout = async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new Error("User tidak terautentikasi");
    }
    const result = await checkoutBorrow(userId, req.body);
    successResponse(res, "Peminjaman berhasil dibuat", result, null, 201);
};
export const updateStatus = async (req, res) => {
    const result = await updateBorrowStatus(req.params.id);
    successResponse(res, "Status peminjaman berhasil diupdate", result);
};
import { cancelBorrow } from "../services/borrow.service.js";
export const remove = async (req, res) => {
    if (!req.params.id) {
        throw new Error("Param id tidak ada");
    }
    const result = await cancelBorrow(req.params.id);
    successResponse(res, "Peminjaman berhasil dibatalkan", result);
};
//# sourceMappingURL=borrow.controller.js.map
