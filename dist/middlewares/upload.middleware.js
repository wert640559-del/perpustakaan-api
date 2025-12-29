import multer from 'multer';
import path from 'path';
// Konfigurasi penyimpanan
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
// Filter tipe file
const fileFilter = (_req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Hanya file gambar yang diperbolehkan (JPEG, JPG, PNG, GIF, WebP)'));
    }
};
// Middleware upload
export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024 // Max 2MB
    },
    fileFilter: fileFilter
});
//# sourceMappingURL=upload.middleware.js.map