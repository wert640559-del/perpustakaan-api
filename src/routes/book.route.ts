import { Router } from "express";
import { BookController } from "../controllers/book.controller";
import { BookService } from "../services/book.service";
import { BookRepository } from "../repositories/book.repository";
import { 
    createBookValidation, 
    updateBookValidation, 
    getBookByIdValidation, 
    searchBookValidation 
} from "../middlewares/book.validation";
import { validate } from "../utils/validator";
import { authenticate } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload.middleware";
import prismaInstance from "../prisma";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Manajemen data buku dan koleksi perpustakaan
 */

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Mendapatkan daftar buku dengan pagination dan filter
 *     tags: [Books]
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
 *         name: title
 *         schema:
 *           type: string
 *         description: Filter berdasarkan judul buku
 *       - in: query
 *         name: authorId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter berdasarkan ID penulis
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter berdasarkan ID kategori
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [title, year, stock, createdAt, updatedAt]
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
 *         description: Berhasil mengambil daftar buku
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
 *                     $ref: '#/components/schemas/Book'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       400:
 *         description: Parameter query tidak valid
 */

/**
 * @swagger
 * /books/stats:
 *   get:
 *     summary: Mendapatkan statistik dashboard buku
 *     tags: [Books]
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
 *                   type: object
 *                   properties:
 *                     totalAvailableBooks:
 *                       type: integer
 *                       description: Total stok buku yang tersedia
 *                     activeTransactions:
 *                       type: integer
 *                       description: Jumlah transaksi peminjaman aktif
 *                     popularBook:
 *                       type: string
 *                       description: Judul buku paling populer
 *       401:
 *         description: Tidak terautentikasi
 */

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Membuat buku baru dengan upload cover
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - isbn
 *               - year
 *               - stock
 *               - authorId
 *               - categoryId
 *               - coverImage
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 example: Laskar Pelangi
 *               isbn:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 13
 *                 example: "9789793062792"
 *               year:
 *                 type: integer
 *                 minimum: 1000
 *                 maximum: 2025
 *                 example: 2005
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *                 example: 10
 *               authorId:
 *                 type: string
 *                 format: uuid
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *                 example: "456e4567-e89b-12d3-a456-426614174000"
 *               description:
 *                 type: string
 *                 example: Novel tentang persahabatan dan pendidikan
 *               coverImage:
 *                 type: string
 *                 format: binary
 *                 description: File gambar cover (JPEG, PNG, max 2MB)
 *     responses:
 *       201:
 *         description: Buku berhasil ditambahkan
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
 *                   $ref: '#/components/schemas/Book'
 *       400:
 *         description: Validasi gagal atau data tidak lengkap
 *       401:
 *         description: Tidak terautentikasi
 *       413:
 *         description: File terlalu besar
 */

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Detail buku berdasarkan ID
 *     tags: [Books]
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
 *         description: Data buku ditemukan
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
 *                   $ref: '#/components/schemas/BookDetail'
 *       404:
 *         description: Buku tidak ditemukan
 *       400:
 *         description: ID tidak valid
 */

/**
 * @swagger
 * /books/{id}:
 *   put:
 *     summary: Update data buku
 *     tags: [Books]
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
 *               title:
 *                 type: string
 *                 minLength: 3
 *               isbn:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 13
 *               year:
 *                 type: integer
 *                 minimum: 1000
 *                 maximum: 2025
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *               description:
 *                 type: string
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
 *                   $ref: '#/components/schemas/Book'
 *       400:
 *         description: Validasi gagal
 *       401:
 *         description: Tidak terautentikasi
 *       404:
 *         description: Buku tidak ditemukan
 */

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Hapus buku (Soft Delete)
 *     tags: [Books]
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
 *         description: Buku berhasil dihapus
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
 *                   $ref: '#/components/schemas/Book'
 *       401:
 *         description: Tidak terautentikasi
 *       404:
 *         description: Buku tidak ditemukan
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *         isbn:
 *           type: string
 *         year:
 *           type: integer
 *         stock:
 *           type: integer
 *         coverImage:
 *           type: string
 *           nullable: true
 *         description:
 *           type: string
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         deletedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *     BookDetail:
 *       allOf:
 *         - $ref: '#/components/schemas/Book'
 *         - type: object
 *           properties:
 *             author:
 *               $ref: '#/components/schemas/Author'
 *             category:
 *               $ref: '#/components/schemas/Category'
 *     Pagination:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *         limit:
 *           type: integer
 *         total:
 *           type: integer
 *         totalPages:
 *           type: integer
 */

// --- Dependency Injection ---
const repo = new BookRepository(prismaInstance);
const service = new BookService(repo);
const controller = new BookController(service);

// --- Routes Definition ---

// 1. Stats diletakkan paling atas agar tidak bertabrakan dengan /:id
router.get("/stats", authenticate, controller.getStats);

// 2. Collection routes
router.get("/", validate(searchBookValidation), controller.list);
router.post(
    "/", 
    authenticate, 
    upload.single('coverImage'), 
    validate(createBookValidation), 
    controller.create
);

// 3. Member routes (menggunakan :id)
router.get("/:id", validate(getBookByIdValidation), controller.getById);
router.put("/:id", authenticate, validate(updateBookValidation), upload.single('coverImage'), controller.update);
router.delete("/:id", authenticate, validate(getBookByIdValidation), controller.remove);

export default router;