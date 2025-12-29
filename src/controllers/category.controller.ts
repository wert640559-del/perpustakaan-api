import type { Request, Response } from "express";
import { successResponse } from "../utils/response";
import type { ICategoryService } from "../services/category.service";

export interface ICategoryController {
    list(req: Request, res: Response): Promise<void>;
    getById(req: Request, res: Response): Promise<void>;
    create(req: Request, res: Response): Promise<void>;
    update(req: Request, res: Response): Promise<void>;
    remove(req: Request, res: Response): Promise<void>;
    getStats(req: Request, res: Response): Promise<void>;
}

export class CategoryController implements ICategoryController {
    constructor(private categoryService: ICategoryService) { 
        this.list = this.list.bind(this);
        this.getById = this.getById.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.remove = this.remove.bind(this);
        this.getStats = this.getStats.bind(this);
    }

    async list(req: Request, res: Response): Promise<void> {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        
        // Menyesuaikan dengan FindAllCategoriesParams di Service
        const search = {
            name: req.query.name as string
        };
        
        const sortBy = req.query.sortBy as string;
        const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'desc';

        const result = await this.categoryService.list({
            page,
            limit,
            search,
            sortBy,
            sortOrder
        });

        const pagination = {
            page: result.currentPage,
            limit,
            total: result.total,
            totalPages: result.totalPages
        };

        successResponse(
            res,
            "Kategori berhasil diambil",
            result.categories,
            pagination
        );
    }

    async getById(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        if (!id) {
            throw new Error("Parameter id tidak ditemukan");
        }

        const category = await this.categoryService.getById(id);

        successResponse(
            res,
            "Kategori berhasil diambil",
            category
        );
    }

    async create(req: Request, res: Response): Promise<void> {
        const { name, description } = req.body;

        if (!name) {
            throw new Error("Nama kategori wajib diisi");
        }

        // Sesuai Prisma.CategoryCreateInput di skema kamu
        const category = await this.categoryService.create({
            name: String(name),
            description: String(description || "")
        });

        successResponse(
            res,
            "Kategori berhasil dibuat",
            category,
            null,
            201
        );
    }

    async update(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        if (!id) {
            throw new Error("Parameter id tidak ditemukan");
        }

        const category = await this.categoryService.update(id, req.body);

        successResponse(
            res,
            "Kategori berhasil diupdate",
            category
        );
    }

    async remove(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        if (!id) {
            throw new Error("Parameter id tidak ditemukan");
        }

        const deleted = await this.categoryService.delete(id);

        successResponse(
            res,
            "Kategori berhasil dihapus",
            deleted
        );
    }

    async getStats(_req: Request, res: Response): Promise<void> {
        const stats = await this.categoryService.getStats();

        successResponse(
            res,
            "Statistik kategori berhasil diambil",
            stats
        );
    }
}