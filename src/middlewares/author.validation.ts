import { body, param, query } from "express-validator";

export const createAuthorValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Nama penulis wajib diisi')
        .isLength({ min: 3 }).withMessage('Nama penulis minimal 3 karakter'),

    body('birthDate')
        .notEmpty().withMessage('Tanggal lahir wajib diisi')
        .isISO8601().withMessage('Format tanggal harus YYYY-MM-DD')
        .custom(value => {
            const date = new Date(value);
            return date < new Date();
        }).withMessage('Tanggal lahir tidak boleh di masa depan')
];

export const updateAuthorValidation = [
    param('id')
        .isUUID().withMessage('ID harus UUID valid'),

    body('name')
        .optional()
        .trim()
        .isLength({ min: 3 }).withMessage('Nama penulis minimal 3 karakter'),

    body('birthDate')
        .optional()
        .isISO8601().withMessage('Format tanggal harus YYYY-MM-DD')
        .custom(value => {
            const date = new Date(value);
            return date < new Date();
        }).withMessage('Tanggal lahir tidak boleh di masa depan')
];

export const getAuthorByIdValidation = [
    param('id')
        .isUUID().withMessage('ID harus UUID valid')
];

export const searchAuthorValidation = [
    query('name')
        .optional()
        .trim()
        .isLength({ min: 1 }).withMessage('Nama pencarian minimal 1 karakter')
];