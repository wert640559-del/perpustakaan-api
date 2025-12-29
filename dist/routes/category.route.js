import { Router } from "express";
import { CategoryController } from "../controllers/category.controller.js";
import { CategoryService } from "../services/category.service.js";
import { CategoryRepository } from "../repositories/category.repository.js";
import { validate } from "../utils/validator.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import prismaInstance from "../database.js";
const router = Router();
/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Manajemen kategori buku
 */
/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Mendapatkan daftar kategori dengan pagination
 *     tags: [Categories]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Nomor halaman
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Jumlah data per halaman
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter berdasarkan nama kategori
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, createdAt, updatedAt]
 *           default: createdAt
 *         description: Field untuk sorting
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Urutan sorting
 *     responses:
 *       200:
 *         description: Berhasil mengambil daftar kategori
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       400:
 *         description: Parameter query tidak valid
 */
/**
 * @swagger
 * /categories/stats:
 *   get:
 *     summary: Mendapatkan statistik buku per kategori
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistik berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       categoryName:
 *                         type: string
 *                       totalBooks:
 *                         type: integer
 *       401:
 *         description: Tidak terautentikasi
 */
/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Membuat kategori baru
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 example: Novel
 *               description:
 *                 type: string
 *                 example: Kumpulan karya fiksi naratif
 *     responses:
 *       201:
 *         description: Kategori berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       400:
 *         description: Validasi gagal atau nama sudah ada
 *       401:
 *         description: Tidak terautentikasi
 */
/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Detail kategori berdasarkan ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Data kategori ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/CategoryDetail'
 *       404:
 *         description: Kategori tidak ditemukan
 *       400:
 *         description: ID tidak valid
 */
/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Update data kategori
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Update kategori berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       400:
 *         description: Validasi gagal
 *       401:
 *         description: Tidak terautentikasi
 *       404:
 *         description: Kategori tidak ditemukan
 */
/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Hapus kategori
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Kategori berhasil dihapus
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       400:
 *         description: Gagal menghapus karena kategori masih memiliki buku aktif
 *       401:
 *         description: Tidak terautentikasi
 *       404:
 *         description: Kategori tidak ditemukan
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         _count:
 *           type: object
 *           properties:
 *             books:
 *               type: integer
 *     CategoryDetail:
 *       allOf:
 *         - $ref: '#/components/schemas/Category'
 *         - type: object
 *           properties:
 *             books:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */
// --- Inisialisasi Layer (DI) ---
const repo = new CategoryRepository(prismaInstance);
const service = new CategoryService(repo);
const controller = new CategoryController(service);
// --- Route Definitions ---
// Route stats diletakkan sebelum :id
router.get("/stats", authenticate, controller.getStats);
router.get("/", controller.list);
router.post("/", authenticate, validate([]), controller.create);
router.get("/:id", controller.getById);
router.put("/:id", authenticate, validate([]), controller.update);
router.delete("/:id", authenticate, controller.remove);
export default router;
//# sourceMappingURL=category.route.js.map
