export class MemberService {
    memberRepo;
    constructor(memberRepo) {
        this.memberRepo = memberRepo;
    }
    async list(params) {
        const { page, limit, search, sortBy, sortOrder } = params;
        const skip = (page - 1) * limit;
        const whereClause = {};
        if (search?.nama) {
            whereClause.nama = { contains: search.nama, mode: 'insensitive' };
        }
        if (search?.email) {
            whereClause.email = { contains: search.email, mode: 'insensitive' };
        }
        if (search?.status) {
            whereClause.status = search.status;
        }
        const sortCriteria = sortBy
            ? { [sortBy]: sortOrder || 'desc' }
            : { createdAt: 'desc' };
        const members = await this.memberRepo.list(skip, limit, whereClause, sortCriteria);
        const total = await this.memberRepo.countAll(whereClause);
        return {
            members,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        };
    }
    async getById(id) {
        const member = await this.memberRepo.findById(id);
        if (!member) {
            throw new Error("Member tidak ditemukan");
        }
        return member;
    }
    async create(data) {
        // 1. Validasi Kode Member Unik
        const existingKode = await this.memberRepo.findByKodeMember(data.kodeMember);
        if (existingKode) {
            throw new Error("Kode Member sudah terdaftar");
        }
        // 2. Validasi Email Unik
        // Catatan: Anda bisa menambahkan method findByEmail di repository member jika diperlukan
        return await this.memberRepo.create(data);
    }
    async update(id, data) {
        await this.getById(id);
        // Validasi jika kode member diubah dan ternyata sudah dipakai orang lain
        if (data.kodeMember && typeof data.kodeMember === 'string') {
            const existingMember = await this.memberRepo.findByKodeMember(data.kodeMember);
            if (existingMember && existingMember.id !== id) {
                throw new Error("Kode Member sudah digunakan oleh member lain");
            }
        }
        return await this.memberRepo.update(id, data);
    }
    async delete(id) {
        await this.getById(id);
        // Menggunakan softDelete yang mengubah status menjadi INACTIVE
        return await this.memberRepo.softDelete(id);
    }
    async getStats() {
        const stats = await this.memberRepo.getStatusStats();
        // Transformasi data agar lebih mudah dibaca di frontend
        return stats.map(s => ({
            status: s.status,
            count: s._count.id
        }));
    }
}
//# sourceMappingURL=member.service.js.map