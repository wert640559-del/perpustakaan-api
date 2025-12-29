import { successResponse } from "../utils/response.js";
export class AuthorController {
    authorService;
    constructor(authorService) {
        this.authorService = authorService;
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
        const search = {
            name: req.query.name
        };
        const sortBy = req.query.sortBy;
        const sortOrder = req.query.sortOrder || "desc";
        const result = await this.authorService.list({
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
        successResponse(res, "Daftar penulis berhasil diambil", result.authors, pagination);
    }
    async getById(req, res) {
        const { id } = req.params;
        if (!id)
            throw new Error("ID penulis diperlukan");
        const author = await this.authorService.getById(id);
        successResponse(res, "Detail penulis berhasil diambil", author);
    }
    async create(req, res) {
        const { name, bio, birthDate } = req.body;
        if (!name || !birthDate) {
            throw new Error("Nama dan tanggal lahir wajib diisi");
        }
        // Sesuai Prisma.AuthorCreateInput di skema kamu
        const author = await this.authorService.create({
            name: String(name),
            bio: bio ? String(bio) : null,
            birthDate: new Date(birthDate) // Pastikan dikonversi ke format Date
        });
        successResponse(res, "Penulis berhasil ditambahkan", author, null, 201);
    }
    async update(req, res) {
        const { id } = req.params;
        if (!id)
            throw new Error("ID penulis diperlukan");
        // Jika ada birthDate di body, pastikan dikonversi ke Date object sebelum masuk service
        const updateData = { ...req.body };
        if (updateData.birthDate) {
            updateData.birthDate = new Date(updateData.birthDate);
        }
        const updatedAuthor = await this.authorService.update(id, updateData);
        successResponse(res, "Data penulis berhasil diperbarui", updatedAuthor);
    }
    async remove(req, res) {
        const { id } = req.params;
        if (!id)
            throw new Error("ID penulis diperlukan");
        const deletedAuthor = await this.authorService.delete(id);
        successResponse(res, "Penulis berhasil dihapus", deletedAuthor);
    }
    async getStats(_req, res) {
        const stats = await this.authorService.getTopAuthors();
        successResponse(res, "Statistik penulis berhasil diambil", stats);
    }
}
//# sourceMappingURL=author.controller.js.map
