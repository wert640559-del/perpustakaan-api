import { Router } from "express";
import { createMemberValidation, getMemberByIdValidation, validate } from "../middlewares/member.validation.js";
import { MemberController } from "../controllers/member.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { MemberRepository } from "../repositories/member.repository.js";
import prismaInstance from "../database.js";
import { MemberService } from "../services/member.service.js";
const router = Router();
/**
 * @swagger
 * tags:
 *   name: Members
 *   description: Manajemen data anggota perpustakaan
 */
/**
 * @swagger
 * /members:
 *   get:
 *     summary: Mendapatkan daftar member dengan pagination dan filter
 *     tags: [Members]
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
 *         name: nama
 *         schema:
 *           type: string
 *         description: Filter berdasarkan nama member
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Filter berdasarkan email member
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, INACTIVE, SUSPENDED]
 *         description: Filter berdasarkan status member
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [nama, email, createdAt, updatedAt]
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
 *         description: Berhasil mengambil daftar member
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
 *                     $ref: '#/components/schemas/Member'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       400:
 *         description: Parameter query tidak valid
 *       401:
 *         description: Tidak terautentikasi
 */
/**
 * @swagger
 * /members/stats:
 *   get:
 *     summary: Mendapatkan statistik status member
 *     tags: [Members]
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
 *                       status:
 *                         type: string
 *                       count:
 *                         type: integer
 *       401:
 *         description: Tidak terautentikasi
 */
/**
 * @swagger
 * /members:
 *   post:
 *     summary: Membuat member baru
 *     tags: [Members]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - kodeMember
 *               - nama
 *               - email
 *               - telepon
 *             properties:
 *               kodeMember:
 *                 type: string
 *                 example: "MBR001"
 *               nama:
 *                 type: string
 *                 minLength: 3
 *                 example: Muhammad Harits
 *               email:
 *                 type: string
 *                 format: email
 *                 example: harits@example.com
 *               telepon:
 *                 type: string
 *                 pattern: '^[0-9]{10,13}$'
 *                 example: "083132212944"
 *               alamat:
 *                 type: string
 *                 example: "Jl. M. Ali No. 30"
 *               userId:
 *                 type: string
 *                 format: uuid
 *                 description: ID user jika terhubung dengan akun
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       201:
 *         description: Member berhasil ditambahkan
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
 *                   $ref: '#/components/schemas/Member'
 *       400:
 *         description: Validasi gagal atau kode/email sudah terdaftar
 *       401:
 *         description: Tidak terautentikasi
 */
/**
 * @swagger
 * /members/{id}:
 *   get:
 *     summary: Detail member berdasarkan ID
 *     tags: [Members]
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
 *         description: Data member ditemukan
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
 *                   $ref: '#/components/schemas/MemberDetail'
 *       401:
 *         description: Tidak terautentikasi
 *       404:
 *         description: Member tidak ditemukan
 */
/**
 * @swagger
 * /members/{id}:
 *   put:
 *     summary: Update data member
 *     tags: [Members]
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
 *               kodeMember:
 *                 type: string
 *               nama:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               telepon:
 *                 type: string
 *               alamat:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE, SUSPENDED]
 *     responses:
 *       200:
 *         description: Member berhasil diperbarui
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
 *                   $ref: '#/components/schemas/Member'
 *       400:
 *         description: Validasi gagal atau kode sudah digunakan
 *       401:
 *         description: Tidak terautentikasi
 *       404:
 *         description: Member tidak ditemukan
 */
/**
 * @swagger
 * /members/{id}:
 *   delete:
 *     summary: Hapus member (Soft Delete - ubah status menjadi INACTIVE)
 *     tags: [Members]
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
 *         description: Member berhasil dinonaktifkan
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
 *                   $ref: '#/components/schemas/Member'
 *       401:
 *         description: Tidak terautentikasi
 *       404:
 *         description: Member tidak ditemukan
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Member:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         kodeMember:
 *           type: string
 *         nama:
 *           type: string
 *         email:
 *           type: string
 *         telepon:
 *           type: string
 *         alamat:
 *           type: string
 *           nullable: true
 *         status:
 *           type: string
 *           enum: [ACTIVE, INACTIVE, SUSPENDED]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     MemberDetail:
 *       allOf:
 *         - $ref: '#/components/schemas/Member'
 *         - type: object
 *           properties:
 *             user:
 *               type: object
 *               nullable: true
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 username:
 *                   type: string
 *                 name:
 *                   type: string
 *                 role:
 *                   type: string
 */
// --- Inisialisasi Layer ---
const repo = new MemberRepository(prismaInstance);
const service = new MemberService(repo);
const controller = new MemberController(service);
// --- Route Definitions ---
router.get("/", authenticate, controller.list);
router.get("/stats", authenticate, controller.getStats);
router.get("/:id", authenticate, validate(getMemberByIdValidation), controller.getById);
router.post("/", authenticate, validate(createMemberValidation), controller.create);
router.put("/:id", authenticate, validate(getMemberByIdValidation), controller.update);
router.delete("/:id", authenticate, validate(getMemberByIdValidation), controller.remove);
export default router;
//# sourceMappingURL=member.route.js.map
