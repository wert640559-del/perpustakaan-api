import { Router } from "express";
import { borrowValidation, returnValidation, getByIdValidation, getAllValidation } from "../middlewares/transaction.validation";
import { TransactionController } from "../controllers/transaction.controller";
import { validate } from "../utils/validator";
import { authenticate } from "../middlewares/auth.middleware";
import { TransactionRepository } from "../repositories/transaction.repository";
import { BookRepository } from "../repositories/book.repository";
import prismaInstance from "../prisma";
import { TransactionService } from "../services/transaction.service";
const router = Router();
/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Manajemen peminjaman dan pengembalian buku
 */
/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Mendapatkan daftar transaksi dengan filter
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
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
 *         name: memberId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter berdasarkan ID member
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [BORROWED, RETURNED, OVERDUE, CANCELLED]
 *         description: Filter berdasarkan status transaksi
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, dueDate, returnDate]
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
 *         description: Berhasil mengambil daftar transaksi
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
 *                     $ref: '#/components/schemas/Transaction'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       401:
 *         description: Tidak terautentikasi
 *       400:
 *         description: Parameter query tidak valid
 */
/**
 * @swagger
 * /transactions/stats:
 *   get:
 *     summary: Mendapatkan statistik transaksi
 *     tags: [Transactions]
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
 *                     overview:
 *                       type: object
 *                       properties:
 *                         totalTransactions:
 *                           type: integer
 *       401:
 *         description: Tidak terautentikasi
 */
/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Membuat peminjaman buku baru
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - memberId
 *               - items
 *               - dueDate
 *             properties:
 *               memberId:
 *                 type: string
 *                 format: uuid
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-12-31"
 *                 description: Tanggal jatuh tempo pengembalian
 *               items:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - bookId
 *                     - quantity
 *                   properties:
 *                     bookId:
 *                       type: string
 *                       format: uuid
 *                       example: "456e4567-e89b-12d3-a456-426614174000"
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *                       example: 1
 *     responses:
 *       201:
 *         description: Peminjaman berhasil dicatat
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
 *                   $ref: '#/components/schemas/TransactionDetail'
 *       400:
 *         description: Validasi gagal, stok tidak cukup, atau member tidak valid
 *       401:
 *         description: Tidak terautentikasi
 */
/**
 * @swagger
 * /transactions/{id}:
 *   get:
 *     summary: Detail transaksi berdasarkan ID
 *     tags: [Transactions]
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
 *         description: Data ditemukan
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
 *                   $ref: '#/components/schemas/TransactionDetail'
 *       401:
 *         description: Tidak terautentikasi
 *       404:
 *         description: Transaksi tidak ditemukan
 */
/**
 * @swagger
 * /transactions/return/{id}:
 *   patch:
 *     summary: Proses pengembalian buku
 *     tags: [Transactions]
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
 *         description: Buku berhasil dikembalikan
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
 *                   $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Transaksi sudah dikembalikan atau ID tidak valid
 *       401:
 *         description: Tidak terautentikasi
 *       404:
 *         description: Transaksi tidak ditemukan
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Transaction:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         memberId:
 *           type: string
 *           format: uuid
 *         status:
 *           type: string
 *           enum: [BORROWED, RETURNED, OVERDUE, CANCELLED]
 *         dueDate:
 *           type: string
 *           format: date-time
 *         returnDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         member:
 *           $ref: '#/components/schemas/Member'
 *     TransactionDetail:
 *       allOf:
 *         - $ref: '#/components/schemas/Transaction'
 *         - type: object
 *           properties:
 *             items:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                   bookId:
 *                     type: string
 *                     format: uuid
 *                   quantity:
 *                     type: integer
 *                   book:
 *                     $ref: '#/components/schemas/Book'
 */
// --- Inisialisasi Layer ---
const transactionRepo = new TransactionRepository(prismaInstance);
const bookRepo = new BookRepository(prismaInstance);
const service = new TransactionService(transactionRepo, bookRepo);
const controller = new TransactionController(service);
// --- Route Definitions ---
router.get('/', authenticate, validate(getAllValidation), controller.list);
router.get('/stats', authenticate, controller.getStats);
router.get('/:id', authenticate, validate(getByIdValidation), controller.getById);
router.post('/', authenticate, validate(borrowValidation), controller.create);
router.patch('/return/:id', authenticate, validate(returnValidation), controller.returnBooks);
export default router;
//# sourceMappingURL=transaction.route.js.map