import express, {} from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import swaggerUi from 'swagger-ui-express'; // Import ini
import swaggerSpec from './utils/swagger'; // Import ini (sesuaikan path jika perlu)
import { successResponse } from './utils/response';
import bookRouter from './routes/book.route';
import authorRouter from './routes/author.route';
import transactionRouter from './routes/transaction.route';
import memberRouter from './routes/member.route';
import authRouter from './routes/auth.route';
import categoryRouter from './routes/category.route';
import { errorHandler } from './middlewares/error.handler';
const app = express();
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
// 1. REGISTRASI SWAGGER UI (Taruh di sini agar bisa diakses publik)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/uploads', express.static(path.join(__dirname, '..', 'public', 'uploads')));
// Timing middleware
app.use((req, _res, next) => {
    console.log(`Request masuk: ${req.method} ${req.path}`);
    req.startTime = Date.now();
    next();
});
// Public routes
app.get('/', (_req, res) => {
    successResponse(res, "Selamat datang di API Perpustakaan!", {
        status: "Server hidup",
        waktu: new Date().toLocaleString('id-ID'),
        docs: "/api-docs" // Tambahkan info docs di sini
    });
});
// Routes
app.use('/api/auth', authRouter);
app.use('/api/books', bookRouter);
app.use('/api/authors', authorRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/members', memberRouter);
app.use('/api/transactions', transactionRouter);
// 2. 404 HANDLER (Gunakan app.use agar menangkap semua method)
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} tidak ada di API Perpustakaan`
    });
});
// Error handler harus paling terakhir
app.use(errorHandler);
export default app;
//# sourceMappingURL=app.js.map