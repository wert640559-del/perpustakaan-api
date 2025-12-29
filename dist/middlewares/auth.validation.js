import { body } from "express-validator";
export const registerValidation = [
    body("username")
        .trim()
        .notEmpty().withMessage("Username wajib diisi")
        .isLength({ min: 3 }).withMessage("Username minimal 3 karakter")
        .matches(/^[a-zA-Z0-9_]+$/).withMessage("Username hanya boleh berisi huruf, angka, dan underscore"),
    body("email")
        .trim()
        .notEmpty().withMessage("Email wajib diisi")
        .isEmail().withMessage("Format email tidak valid")
        .normalizeEmail(),
    body("password")
        .notEmpty().withMessage("Password wajib diisi")
        .isLength({ min: 6 }).withMessage("Password minimal 6 karakter"),
    body("name")
        .trim()
        .notEmpty().withMessage("Nama lengkap wajib diisi")
        .isLength({ min: 3 }).withMessage("Nama minimal 3 karakter"),
    body("role")
        .optional()
        .isIn(["ADMIN", "LIBRARIAN", "MEMBER"]).withMessage("Role harus ADMIN, LIBRARIAN, atau MEMBER")
];
export const loginValidation = [
    body("username")
        .trim()
        .notEmpty().withMessage("Username wajib diisi"),
    body("password")
        .notEmpty().withMessage("Password wajib diisi")
];
//# sourceMappingURL=auth.validation.js.map