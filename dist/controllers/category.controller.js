import { successResponse } from "../utils/response";
export class CategoryController {
    categoryService;
    constructor(categoryService) {
        this.categoryService = categoryService;
        this.list = this.list.bind(this);
        this.getById = this.getById.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.remove = this.remove.bind(this);
        this.getStats = this.getStats.bind(this);
    }
    async list(req, res) {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        // Menyesuaikan dengan FindAllCategoriesParams di Service
        const search = {
            name: req.query.name
        };
        const sortBy = req.query.sortBy;
        const sortOrder = req.query.sortOrder || 'desc';
        const result = await this.categoryService.list({
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
        successResponse(res, "Kategori berhasil diambil", result.categories, pagination);
    }
    async getById(req, res) {
        const { id } = req.params;
        if (!id) {
            throw new Error("Parameter id tidak ditemukan");
        }
        const category = await this.categoryService.getById(id);
        successResponse(res, "Kategori berhasil diambil", category);
    }
    async create(req, res) {
        const { name, description } = req.body;
        if (!name) {
            throw new Error("Nama kategori wajib diisi");
        }
        // Sesuai Prisma.CategoryCreateInput di skema kamu
        const category = await this.categoryService.create({
            name: String(name),
            description: String(description || "")
        });
        successResponse(res, "Kategori berhasil dibuat", category, null, 201);
    }
    async update(req, res) {
        const { id } = req.params;
        if (!id) {
            throw new Error("Parameter id tidak ditemukan");
        }
        const category = await this.categoryService.update(id, req.body);
        successResponse(res, "Kategori berhasil diupdate", category);
    }
    async remove(req, res) {
        const { id } = req.params;
        if (!id) {
            throw new Error("Parameter id tidak ditemukan");
        }
        const deleted = await this.categoryService.delete(id);
        successResponse(res, "Kategori berhasil dihapus", deleted);
    }
    async getStats(_req, res) {
        const stats = await this.categoryService.getStats();
        successResponse(res, "Statistik kategori berhasil diambil", stats);
    }
}
//# sourceMappingURL=category.controller.js.map