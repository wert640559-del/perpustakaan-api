import type { Request, Response } from "express";
import { successResponse } from "../utils/response";
import type { IMemberService } from "../services/member.service";

export interface IMemberController {
    list(req: Request, res: Response): Promise<void>;
    getById(req: Request, res: Response): Promise<void>;
    getByUserId(req: Request, res: Response): Promise<void>;
    create(req: Request, res: Response): Promise<void>;
    update(req: Request, res: Response): Promise<void>;
    remove(req: Request, res: Response): Promise<void>;
    getStats(req: Request, res: Response): Promise<void>;
}

export class MemberController implements IMemberController {
    constructor(private memberService: IMemberService) {
        this.list = this.list.bind(this);
        this.getById = this.getById.bind(this);
        this.getByUserId = this.getByUserId.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.remove = this.remove.bind(this);
        this.getStats = this.getStats.bind(this);
    }

    async list(req: Request, res: Response) {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const searchNama = req.query.nama as string | undefined;
        const searchEmail = req.query.email as string | undefined;
        const searchStatus = req.query.status as any;
        const sortBy = req.query.sortBy as string;
        const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'desc';

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

    async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) return res.status(400).json({ success: false, message: "ID member diperlukan" });

            const member = await this.memberService.getById(id);
            return successResponse(res, "Data member berhasil diambil", member);
        } catch (error: any) {
            return res.status(404).json({ success: false, message: error.message });
        }
    }

    async getByUserId(req: Request, res: Response) {
        try {
            const { userId } = req.params;
            // PERBAIKAN: Panggil service khusus userId, bukan getById
            const member = await this.memberService.getByUserId(userId); 
            return successResponse(res, "Profil member berhasil diambil", member);
        } catch (error: any) {
            return res.status(404).json({ success: false, message: error.message });
        }
    }

    async create(req: Request, res: Response) {
        const { kodeMember, nama, email, telepon, alamat, userId } = req.body;

        if (!kodeMember || !nama || !email) throw new Error("Data wajib diisi (Kode, Nama, Email)");

        const createData: any = {
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

    async update(req: Request, res: Response) {
        const { id } = req.params;
        if (!id) throw new Error("ID member diperlukan");

        const updateData = { ...req.body };

        const member = await this.memberService.update(id, updateData);
        successResponse(res, "Member berhasil diperbarui", member);
    }

    async remove(req: Request, res: Response) {
        if (!req.params.id) throw new Error("ID member diperlukan");
        
        const deleted = await this.memberService.delete(req.params.id);
        successResponse(res, "Member berhasil dihapus/dinonaktifkan", deleted);
    }

    async getStats(_req: Request, res: Response) {
        const stats = await this.memberService.getStats();
        successResponse(res, "Statistik member berhasil diambil", stats);
    }
}