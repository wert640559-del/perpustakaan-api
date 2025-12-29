import { body, param, query } from "express-validator";
export const createBookValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Judul buku wajib diisi')
        .isLength({ min: 3 }).withMessage('Judul buku minimal 3 karakter'),
    body('isbn')
        .trim()
        .notEmpty().withMessage('ISBN wajib diisi')
        .isLength({ min: 10, max: 13 }).withMessage('ISBN harus 10-13 karakter'),
    body('year')
        .isInt({ min: 1000, max: new Date().getFullYear() })
        .withMessage('Tahun terbit harus valid'),
    body('stock')
        .isInt({ min: 0 }).withMessage('Stok tidak boleh negatif'),
    body('authorId')
        .trim()
        .notEmpty().withMessage('ID penulis wajib diisi')
        .isUUID().withMessage('ID penulis harus UUID valid')
];
export const updateBookValidation = [
    param('id')
        .isUUID().withMessage('ID harus UUID valid'),
    body('isbn')
        .optional()
        .trim()
        .isLength({ min: 10, max: 13 }).withMessage('ISBN harus 10-13 karakter'),
    body('year')
        .optional()
        .isInt({ min: 1000, max: new Date().getFullYear() })
        .withMessage('Tahun terbit harus valid'),
    body('stock')
        .optional()
        .isInt({ min: 0 }).withMessage('Stok tidak boleh negatif')
];
export const getBookByIdValidation = [
    param('id')
        .isUUID().withMessage('ID harus UUID valid')
];
export const searchBookValidation = [
    query('title')
        .optional()
        .trim()
        .isLength({ min: 1 }).withMessage('Judul pencarian minimal 1 karakter'),
    query('author')
        .optional()
        .trim()
        .isLength({ min: 1 }).withMessage('Nama penulis pencarian minimal 1 karakter'),
    query('year')
        .optional()
        .isInt({ min: 1000, max: new Date().getFullYear() })
        .withMessage('Tahun harus valid')
];
//# sourceMappingURL=book.validation.js.map