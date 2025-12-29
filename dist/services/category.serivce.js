import * as categoryRepo from "../repositories/category.repository";
export const getAllCategories = async (params) => {
    const { page, limit, search, sortBy, sortOrder } = params;
    const skip = (page - 1) * limit;
    const whereClause = {};
    if (search?.name) {
        whereClause.name = {
            contains: search.name,
            mode: 'insensitive'
        };
    }
    const sortCriteria = sortBy
        ? { [sortBy]: sortOrder || 'desc' }
        : { createdAt: 'desc' };
    const categories = await categoryRepo.list(skip, limit, whereClause, sortCriteria);
    const total = await categoryRepo.countAll(whereClause);
    return {
        categories,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page
    };
};
export const getCategoryById = async (id) => {
    const category = await categoryRepo.findById(id);
    if (!category) {
        throw new Error("Kategori tidak ditemukan");
    }
    return category;
};
export const createCategory = async (name) => {
    const existingCategory = await categoryRepo.findByName(name);
    if (existingCategory) {
        throw new Error("Kategori dengan nama tersebut sudah ada");
    }
    return await categoryRepo.create({ name });
};
export const updateCategory = async (id, data) => {
    await getCategoryById(id);
    if (data.name) {
        const existingCategory = await categoryRepo.findByName(data.name);
        if (existingCategory && existingCategory.id !== id) {
            throw new Error("Kategori dengan nama tersebut sudah ada");
        }
    }
    return await categoryRepo.update(id, data);
};
export const deleteCategory = async (id) => {
    const category = await getCategoryById(id);
    if (category.books && category.books.length > 0) {
        throw new Error("Kategori masih memiliki buku. Hapus atau pindahkan buku terlebih dahulu.");
    }
    return await categoryRepo.deleteCategory(id);
};
//# sourceMappingURL=category.serivce.js.map