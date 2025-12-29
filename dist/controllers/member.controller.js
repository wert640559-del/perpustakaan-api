import { successResponse } from "../utils/response.js";
export class MemberController {
    memberService;
    constructor(memberService) {
        this.memberService = memberService;
        this.list = this.list.bind(this);
        this.getById = this.getById.bind(this);
        // this.getByUserId = this.getByUserId.bind(this);
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
        const sortOrder = req.query.sortOrder || "desc";
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
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({ success: false, message: "ID member diperlukan" });
                return;
            }
            const member = await this.memberService.getById(id);
            successResponse(res, "Data member berhasil diambil", member);
        }
        catch (error) {
            res.status(404).json({ success: false, message: error.message });
        }
    }
    // async getByUserId(req: Request, res: Response): Promise<void> {
    //     try {
    //         const { userId } = req.params;
    //         if (!userId) {
    //             res.status(400).json({ success: false, message: "User ID diperlukan" });
    //             return; // Berhenti di sini, tapi tidak mengembalikan nilai (tetap void)
    //         }
    //         const member = await this.memberService.getByUserId(userId); 
    //         // Panggil successResponse tanpa kata kunci 'return'
    //         successResponse(res, "Profil member berhasil diambil", member);
    //     } catch (error: any) {
    //         res.status(404).json({ success: false, message: error.message });
    //         // Tidak perlu return di sini karena sudah akhir dari blok fungsi
    //     }
    // }
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
