export class CategoryService {
    categoryRepo;
    constructor(categoryRepo) {
        this.categoryRepo = categoryRepo;
    }
    async list(params) {
        const { page, limit, search, sortBy, sortOrder } = params;
        const skip = (page - 1) * limit;
        const whereClause = {};
        if (search?.name) {
            whereClause.name = { contains: search.name, mode: 'insensitive' };
        }
        const sortCriteria = sortBy
            ? { [sortBy]: sortOrder || 'desc' }
            : { createdAt: 'desc' };
        const categories = await this.categoryRepo.list(skip, limit, whereClause, sortCriteria);
        const total = await this.categoryRepo.countAll(whereClause);
        return {
            categories,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        };
    }
    async getById(id) {
        const category = await this.categoryRepo.findById(id);
        if (!category) {
            throw new Error("Kategori tidak ditemukan");
        }
        return category;
    }
    async create(data) {
        // Nama kategori biasanya unik, Prisma akan melempar error jika duplikat
        // sesuai dengan atribut @unique di skema kamu.
        return await this.categoryRepo.create(data);
    }
    async update(id, data) {
        await this.getById(id);
        return await this.categoryRepo.update(id, data);
    }
    async delete(id) {
        const category = await this.getById(id);
        // Logic tambahan: Cegah hapus kategori jika masih ada buku di dalamnya
        if (category.books && category.books.length > 0) {
            throw new Error("Kategori tidak bisa dihapus karena masih memiliki buku aktif");
        }
        return await this.categoryRepo.delete(id);
    }
    /**
     * Mengikuti pola exec() di ProductService Anda
     */
    async getStats() {
        const bookCounts = await this.categoryRepo.getCategoryBookStats();
        // Kita bisa memperkaya data ini dengan mengambil nama kategori 
        // agar dashboard tidak hanya menampilkan ID
        const categories = await this.categoryRepo.list(0, 100, {}, {});
        return bookCounts.map(stat => {
            const categoryName = categories.find(c => c.id === stat.categoryId)?.name || "Unknown";
            return {
                categoryName,
                totalBooks: stat._count.id
            };
        });
    }
}
//# sourceMappingURL=category.service.js.map