export class MemberRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(skip, take, where, orderBy) {
        return await this.prisma.member.findMany({
            skip,
            take,
            where: {
                ...where,
                // Catatan: Pastikan menambahkan deletedAt di schema Member jika ingin menggunakan ini
                // deletedAt: null 
            },
            orderBy,
            include: { user: true }
        });
    }
    async countAll(where) {
        return await this.prisma.member.count({
            where: {
                ...where,
                // deletedAt: null
            }
        });
    }
    async findById(id) {
        return await this.prisma.member.findUnique({
            where: {
                id,
                // deletedAt: null,
            },
            include: {
                user: true
            }
        });
    }
    async findByUserId(userId) {
        return await this.prisma.member.findFirst({
            where: {
                userId: userId,
                // deletedAt: null 
            }
        });
    }
    async findByKodeMember(kodeMember) {
        return await this.prisma.member.findUnique({
            where: { kodeMember }
        });
    }
    async create(data) {
        return await this.prisma.member.create({ data });
    }
    async update(id, data) {
        return await this.prisma.member.update({
            where: { id },
            data
        });
    }
    async softDelete(id) {
        // Jika belum ada deletedAt di Prisma, Anda bisa mengubah status menjadi INACTIVE
        return await this.prisma.member.update({
            where: { id },
            data: {
                status: 'INACTIVE'
                // deletedAt: new Date() // Gunakan ini jika sudah ada di schema
            }
        });
    }
    async getStatusStats() {
        return await this.prisma.member.groupBy({
            by: ['status'],
            // where: { deletedAt: null },
            _count: { id: true }
        });
    }
}
//# sourceMappingURL=member.repository.js.map