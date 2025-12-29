import { body, param, query } from "express-validator";

export const borrowValidation = [
  body('memberId')
    .trim()
    .notEmpty().withMessage('ID anggota wajib diisi')
    .isLength({ min: 1 }).withMessage('ID anggota minimal 1 karakter'),

  body('books')
    .isArray({ min: 1 }).withMessage('Daftar buku wajib diisi minimal 1 buku')
    .custom((books: any[]) => {
      if (!Array.isArray(books)) {
        throw new Error('Books harus berupa array');
      }
      
      for (const book of books) {
        if (!book.bookId) {
          throw new Error('Setiap buku harus memiliki bookId');
        }
        if (!book.quantity || book.quantity < 1) {
          throw new Error('Quantity harus minimal 1');
        }
      }
      return true;
    }),

  body('dueDate')
    .notEmpty().withMessage('Tanggal jatuh tempo wajib diisi')
    .isISO8601().withMessage('Format tanggal harus YYYY-MM-DD')
    .custom(value => {
      const dueDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (dueDate <= today) {
        throw new Error('Tanggal jatuh tempo harus di masa depan');
      }
      return true;
    })
];

export const returnValidation = [
  param('id')
    .trim()
    .notEmpty().withMessage('ID transaksi wajib diisi')
    .isUUID().withMessage('ID transaksi harus UUID valid')
];

export const getByIdValidation = [
  param('id')
    .trim()
    .notEmpty().withMessage('ID transaksi wajib diisi')
    .isUUID().withMessage('ID transaksi harus UUID valid')
];

export const getAllValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page harus angka positif'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit harus antara 1-100'),
  
  query('memberId')
    .optional()
    .trim()
    .isLength({ min: 1 }).withMessage('Member ID minimal 1 karakter'),
  
  query('status')
    .optional()
    .isIn(['BORROWED', 'RETURNED', 'OVERDUE', 'CANCELLED'])
    .withMessage('Status harus salah satu dari: BORROWED, RETURNED, OVERDUE, CANCELLED')
];