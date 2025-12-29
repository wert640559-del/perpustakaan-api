import { successResponse } from "../utils/response";
export class MemberController {
    memberService;
    constructor(memberService) {
        this.memberService = memberService;
        this.list = this.list.bind(this);
        this.getById = this.getById.bind(this);
        this.getByUserId = this.getByUserId.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.remove = this.remove.bind(this);
        this.getStats = this.getStats.bind(this);
    }
    async list(req, res) {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const searchNama = req.query.nama;
        const searchEmail = req.query.email;
        const searchStatus = req.query.status;
        const sortBy = req.query.sortBy;
        const sortOrder = req.query.sortOrder || 'desc';
        const result = await this.memberService.list({
            page,
            limit,
            search: {
                ...(searchNama && { nama: searchNama }),
                ...(searchEmail && { email: searchEmail }),
                ...(searchStatus && { status: searchStatus })
            },
            sortBy,
            sortOrder
        });
        const pagination = {
            page: result.currentPage,
            limit,
            total: result.total,
            totalPages: result.totalPages
        };
        successResponse(res, "Daftar member berhasil diambil", result.members, pagination);
    }
    async getById(req, res) {
        if (!req.params.id)
            throw new Error("ID member diperlukan");
        const member = await this.memberService.getById(req.params.id);
        successResponse(res, "Data member berhasil diambil", member);
    }
    async getByUserId(req, res) {
        const userId = req.params.userId;
        if (!userId)
            throw new Error("User ID tidak valid");
        // Catatan: Pastikan di member.repository kamu ada method findByUserId
        const member = await this.memberService.getById(userId);
        successResponse(res, "Profil member berdasarkan user berhasil diambil", member);
    }
    async create(req, res) {
        const { kodeMember, nama, email, telepon, alamat, userId } = req.body;
        if (!kodeMember || !nama || !email)
            throw new Error("Data wajib diisi (Kode, Nama, Email)");
        const createData = {
            kodeMember: String(kodeMember),
            nama: String(nama),
            email: String(email),
            telepon: String(telepon),
            alamat: alamat ? String(alamat) : null,
        };
        // Jika ada relasi userId (UUID String)
        if (userId) {
            createData.user = { connect: { id: String(userId) } };
        }
        const member = await this.memberService.create(createData);
        successResponse(res, "Member berhasil dibuat", member, null, 201);
    }
    async update(req, res) {
        const { id } = req.params;
        if (!id)
            throw new Error("ID member diperlukan");
        const updateData = { ...req.body };
        const member = await this.memberService.update(id, updateData);
        successResponse(res, "Member berhasil diperbarui", member);
    }
    async remove(req, res) {
        if (!req.params.id)
            throw new Error("ID member diperlukan");
        const deleted = await this.memberService.delete(req.params.id);
        successResponse(res, "Member berhasil dihapus/dinonaktifkan", deleted);
    }
    async getStats(_req, res) {
        const stats = await this.memberService.getStats();
        successResponse(res, "Statistik member berhasil diambil", stats);
    }
}
//# sourceMappingURL=member.controller.js.map