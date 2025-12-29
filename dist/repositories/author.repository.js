export class AuthorRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(skip, limit, where, orderBy) {
        return await this.prisma.author.findMany({
            skip,
            take: limit,
            where,
            orderBy,
            include: {
                _count: {
                    select: { books: true }
                }
            }
        });
    }
    async countAll(where) {
        return await this.prisma.author.count({ where });
    }
    async findById(id) {
        return await this.prisma.author.findUnique({
            where: { id },
            include: {
                books: {
                    where: { deletedAt: null },
                    include: { category: true }
                }
            }
        });
    }
    async findByName(name) {
        return await this.prisma.author.findUnique({
            where: { name }
        });
    }
    async create(data) {
        return await this.prisma.author.create({ data });
    }
    async update(id, data) {
        return await this.prisma.author.update({
            where: { id },
            data
        });
    }
    async delete(id) {
        // Note: Skema Anda menggunakan onDelete: Cascade pada relasi Book.
        // Menghapus Author akan menghapus semua buku terkait!
        return await this.prisma.author.delete({
            where: { id }
        });
    }
    /**
     * Analytics: Mendapatkan penulis yang paling banyak memiliki koleksi buku
     */
    async getAuthorStats() {
        return await this.prisma.author.findMany({
            select: {
                name: true,
                _count: {
                    select: { books: true }
                }
            },
            orderBy: {
                books: {
                    _count: 'desc'
                }
            },
            take: 5
        });
    }
}
//# sourceMappingURL=author.repository.js.map