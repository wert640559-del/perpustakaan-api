export class UserRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByEmail(email) {
        return await this.prisma.user.findUnique({
            where: { email }
        });
    }
    async findByUsername(username) {
        return await this.prisma.user.findUnique({
            where: { username }
        });
    }
    async list(skip, take, where, orderBy) {
        return await this.prisma.user.findMany({
            skip,
            take,
            where,
            orderBy,
            include: {
                member: true // Melihat data profil member terkait
            }
        });
    }
    async countAll(where) {
        return await this.prisma.user.count({ where });
    }
    async findById(id) {
        return await this.prisma.user.findUnique({
            where: { id },
            include: {
                member: true
            }
        });
    }
    async create(data) {
        return await this.prisma.user.create({
            data
        });
    }
    async update(id, data) {
        return await this.prisma.user.update({
            where: { id },
            data
        });
    }
    async delete(id) {
        return await this.prisma.user.delete({
            where: { id }
        });
    }
}
//# sourceMappingURL=user.repository.js.map