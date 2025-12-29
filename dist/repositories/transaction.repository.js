export class TransactionRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async countAll(where) {
        return await this.prisma.transaction.count({
            where
        });
    }
    async list(skip, take, where, orderBy) {
        return await this.prisma.transaction.findMany({
            skip,
            take,
            where,
            orderBy,
            include: {
                member: true,
                _count: { select: { items: true } }
            }
        });
    }
    async findById(id) {
        return await this.prisma.transaction.findUnique({
            where: { id },
            include: {
                member: true,
                items: {
                    include: {
                        book: true
                    }
                }
            }
        });
    }
    async create(data) {
        return await this.prisma.transaction.create({
            data,
            include: {
                items: true
            }
        });
    }
    async update(id, data) {
        return await this.prisma.transaction.update({
            where: { id },
            data,
            include: {
                items: true
            }
        });
    }
    async softDelete(id) {
        return await this.prisma.transaction.update({
            where: { id },
            data: {
                status: 'CANCELLED'
            }
        });
    }
    async getStats() {
        return await this.prisma.transaction.aggregate({
            _count: { id: true },
        });
    }
}
//# sourceMappingURL=transaction.repository.js.map