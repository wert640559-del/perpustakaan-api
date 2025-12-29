import { body, param } from "express-validator";
export const createBorrowValidation = [
    body('user_id').isNumeric().withMessage('User ID harus angka').custom(value => value > 0),
    body('total').isNumeric().withMessage('Total harus angka').custom(value => value > 0),
    body('borrowItems').isArray().withMessage('Borrow items harus berupa array'),
    body('borrowItems.*.book_id').isNumeric().withMessage('Book ID harus angka'),
    body('borrowItems.*.quantity').isNumeric().withMessage('Quantity harus angka')
];
export const getBorrowByIdValidation = [
    param('id').isNumeric().withMessage('ID harus angka')
];
//# sourceMappingURL=borrow.validation.js.map