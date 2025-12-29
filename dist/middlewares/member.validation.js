import { body, param, validationResult } from "express-validator";
import { errorResponse } from "../utils/response";
export const validate = (validations) => {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)));
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }
        const errorList = errors.array().map(err => ({
            field: err.type === 'field' ? err.path : 'unknown',
            message: err.msg
        }));
        return errorResponse(res, "Validasi tidak berhasil", 400, errorList);
    };
};
export const createMemberValidation = [
    body('nama')
        .trim()
        .notEmpty().withMessage('Nama harus diisi')
        .isLength({ min: 3 }).withMessage('Nama minimal 3 karakter'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email wajib diisi')
        .isEmail().withMessage('Format email tidak valid'),
    body('telepon')
        .trim()
        .notEmpty().withMessage('Telepon wajib diisi')
        .matches(/^[0-9]+$/).withMessage('Telepon harus angka')
        .isLength({ min: 10, max: 13 }).withMessage('Telepon harus 10-13 digit'),
    body('tanggal_daftar')
        .optional()
        .isDate().withMessage('Format tanggal tidak valid (YYYY-MM-DD)')
];
export const getMemberByIdValidation = [
    param('id')
        .isNumeric().withMessage('Id harus angka')
        .custom(value => parseInt(value) > 0).withMessage('Id harus lebih dari 0')
];
//# sourceMappingURL=member.validation.js.map