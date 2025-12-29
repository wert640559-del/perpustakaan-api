export class CategoryRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(skip, take, where, orderBy) {
        return await this.prisma.category.findMany({
            skip,
            take,
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
        return await this.prisma.category.count({ where });
    }
    async findById(id) {
        return await this.prisma.category.findUnique({
            where: { id },
            include: {
                books: {
                    where: { deletedAt: null } // Hanya buku yang belum di-soft delete
                }
            }
        });
    }
    async create(data) {
        return await this.prisma.category.create({ data });
    }
    async update(id, data) {
        return await this.prisma.category.update({
            where: { id },
            data
        });
    }
    async delete(id) {
        // Karena di skema Category Anda belum ada deletedAt, 
        // ini menggunakan delete permanen.
        return await this.prisma.category.delete({
            where: { id }
        });
    }
    /**
     * Implementasi Analytics:
     * Menghitung jumlah buku per kategori (Mirip fungsi di ProductRepo Anda)
     */
    async getCategoryBookStats() {
        return await this.prisma.book.groupBy({
            by: ['categoryId'],
            where: { deletedAt: null },
            _count: {
                id: true
            }
        });
    }
}
//# sourceMappingURL=category.repository.js.map