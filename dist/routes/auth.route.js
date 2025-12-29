import { Router } from "express";
import { AuthController } from "../controllers/user.controller.js";
import { AuthService } from "../services/user.service.js";
import { UserRepository } from "../repositories/user.repository.js";
import { loginValidation, registerValidation } from "../middlewares/auth.validation.js";
import { validate } from "../utils/validator.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import prismaInstance from "../database.js";
const router = Router();
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Operasi autentikasi pengguna
 */
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrasi pengguna baru
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - name
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 example: harits
 *               email:
 *                 type: string
 *                 format: email
 *                 example: harits@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: rahasia123
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 example: Muhammad Harits
 *               role:
 *                 type: string
 *                 enum: [ADMIN, LIBRARIAN, MEMBER]
 *                 default: MEMBER
 *                 example: MEMBER
 *     responses:
 *       201:
 *         description: Berhasil registrasi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Registrasi berhasil
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *                     role:
 *                       type: string
 *       400:
 *         description: Validasi gagal atau data sudah terdaftar
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login untuk mendapatkan token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: harits
 *               email:
 *                 type: string
 *                 format: email
 *                 example: harits@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: rahasia123
 *     responses:
 *       200:
 *         description: Login berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Login berhasil
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           format: uuid
 *                         username:
 *                           type: string
 *                         email:
 *                           type: string
 *                         name:
 *                           type: string
 *                         role:
 *                           type: string
 *                     token:
 *                       type: string
 *                       description: JWT token untuk autentikasi
 *       401:
 *         description: Email atau password salah
 *       400:
 *         description: Validasi gagal
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Mendapatkan profil user yang sedang login
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Data profil berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Data profil user berhasil diambil
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *                     role:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Tidak terautentikasi
 *       404:
 *         description: User tidak ditemukan
 *       500:
 *         description: Server error
 */
// Inisialisasi Layer
const repo = new UserRepository(prismaInstance);
const service = new AuthService(repo);
const controller = new AuthController(service);
// Endpoints
router.post("/register", validate(registerValidation), (req, res) => controller.register(req, res));
router.post("/login", validate(loginValidation), (req, res) => controller.login(req, res));
router.get("/me", authenticate, (req, res) => controller.me(req, res));
export default router;
//# sourceMappingURL=auth.route.js.map
