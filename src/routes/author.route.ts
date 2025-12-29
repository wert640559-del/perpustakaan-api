import { Router } from "express";
import { AuthorController } from "../controllers/author.controller";
import { AuthorService } from "../services/author.service";
import { AuthorRepository } from "../repositories/author.repository";
import { 
    createAuthorValidation, 
    updateAuthorValidation, 
    getAuthorByIdValidation, 
    searchAuthorValidation 
} from "../middlewares/author.validation";
import { validate } from "../utils/validator";
import { authenticate } from "../middlewares/auth.middleware";
import prismaInstance from "../prisma";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Authors
 *   description: Manajemen data penulis buku
 */

/**
 * @swagger
 * /authors:
 *   get:
 *     summary: Mendapatkan daftar penulis dengan pagination dan filter
 *     tags: [Authors]
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
 *         description: Filter berdasarkan nama penulis (case-insensitive)
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, birthDate, createdAt, updatedAt]
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
 *         description: Berhasil mengambil daftar penulis
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
 *                     $ref: '#/components/schemas/Author'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       400:
 *         description: Parameter query tidak valid
 */

/**
 * @swagger
 * /authors/stats:
 *   get:
 *     summary: Mendapatkan statistik penulis terproduktif
 *     tags: [Authors]
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
 *                       name:
 *                         type: string
 *                       bookCount:
 *                         type: integer
 *       401:
 *         description: Tidak terautentikasi
 */

/**
 * @swagger
 * /authors:
 *   post:
 *     summary: Menambahkan penulis baru
 *     tags: [Authors]
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
 *               - birthDate
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 example: Andrea Hirata
 *               bio:
 *                 type: string
 *                 example: Penulis novel bestseller Laskar Pelangi
 *               birthDate:
 *                 type: string
 *                 format: date
 *                 example: "1967-10-24"
 *     responses:
 *       201:
 *         description: Penulis berhasil ditambahkan
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
 *                   $ref: '#/components/schemas/Author'
 *       400:
 *         description: Validasi gagal atau nama sudah terdaftar
 *       401:
 *         description: Tidak terautentikasi
 */

/**
 * @swagger
 * /authors/{id}:
 *   get:
 *     summary: Detail penulis berdasarkan ID
 *     tags: [Authors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *         description: UUID penulis
 *     responses:
 *       200:
 *         description: Data penulis ditemukan
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
 *                   $ref: '#/components/schemas/AuthorDetail'
 *       404:
 *         description: Penulis tidak ditemukan
 *       400:
 *         description: ID tidak valid
 */

/**
 * @swagger
 * /authors/{id}:
 *   put:
 *     summary: Update data penulis
 *     tags: [Authors]
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
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 example: Andrea Hirata S.T.
 *               bio:
 *                 type: string
 *               birthDate:
 *                 type: string
 *                 format: date
 *                 example: "1967-10-24"
 *     responses:
 *       200:
 *         description: Update berhasil
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
 *                   $ref: '#/components/schemas/Author'
 *       400:
 *         description: Validasi gagal atau nama sudah digunakan
 *       401:
 *         description: Tidak terautentikasi
 *       404:
 *         description: Penulis tidak ditemukan
 */

/**
 * @swagger
 * /authors/{id}:
 *   delete:
 *     summary: Hapus data penulis
 *     tags: [Authors]
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
 *         description: Penulis berhasil dihapus
 *       400:
 *         description: Gagal karena penulis masih memiliki buku aktif
 *       401:
 *         description: Tidak terautentikasi
 *       404:
 *         description: Penulis tidak ditemukan
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Author:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         bio:
 *           type: string
 *           nullable: true
 *         birthDate:
 *           type: string
 *           format: date
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
 *     AuthorDetail:
 *       allOf:
 *         - $ref: '#/components/schemas/Author'
 *         - type: object
 *           properties:
 *             books:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                   title:
 *                     type: string
 *                   isbn:
 *                     type: string
 */

// --- Inisialisasi Layer (Dependency Injection) ---
const repo = new AuthorRepository(prismaInstance);
const service = new AuthorService(repo);
const controller = new AuthorController(service);

// --- ROUTE URUTAN PENTING: STATS DULU, BARU :id ---

// 1. Route stats HARUS SEBELUM route :id
router.get("/stats", authenticate, (req, res) => controller.getStats(req, res));

// 2. Collection routes (tanpa ID)
router.get("/", 
    validate(searchAuthorValidation), 
    (req, res) => controller.list(req, res)
);

router.post("/", 
    authenticate, 
    validate(createAuthorValidation), 
    (req, res) => controller.create(req, res)
);

// 3. Member routes (dengan ID) - HARUS DI BAWAH
router.get("/:id", 
    validate(getAuthorByIdValidation), 
    (req, res) => controller.getById(req, res)
);

router.put("/:id", 
    authenticate, 
    validate(updateAuthorValidation), 
    (req, res) => controller.update(req, res)
);

router.delete("/:id", 
    authenticate, 
    validate(getAuthorByIdValidation), 
    (req, res) => controller.remove(req, res)
);

export default router;