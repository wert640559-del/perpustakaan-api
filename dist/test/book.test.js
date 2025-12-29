import app from "../app";
import request from 'supertest';
import jwt from 'jsonwebtoken';
import config from '../utils/env';
import path from 'path';
describe("GET /api/books", () => {
    it("Should return 200 and list of book", async () => {
        const res = await request(app).get('/api/books');
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
    });
});
describe('GET /api/book/:id', () => {
    it('should return 200 and book that has been found', async () => {
        // Get first book from list
        const listRes = await request(app).get('/api/books?limit=1');
        const bookId = listRes.body.data[0]?.id;
        if (bookId) {
            const res = await request(app)
                .get(`/api/books/${bookId}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body.success).toBe(true);
        }
    });
});
describe('GET /api/book/stats', () => {
    const token = jwt.sign({ id: '1', role: 'ADMIN' }, config.JWT_SECRET);
    it('Should return 401 if no token provided', async () => {
        const res = await request(app)
            .get('/api/books/stats');
        expect(res.statusCode).toEqual(401);
        expect(res.body.success).toBe(false);
    });
    it('Should return 200 and book statistic has been found', async () => {
        const res = await request(app)
            .get('/api/books/stats')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
    });
});
describe('POST /api/book', () => {
    const token = jwt.sign({ id: '1', role: 'ADMIN' }, config.JWT_SECRET);
    it('should return 401 if no token provided', async () => {
        const authorRes = await request(app).get('/api/authors?limit=1');
        const categoryRes = await request(app).get('/api/categories?limit=1');
        const authorId = authorRes.body.data[0]?.id;
        const categoryId = categoryRes.body?.data?.categories?.[0]?.id;
        if (authorId && categoryId) {
            const res = await request(app)
                .post('/api/books')
                .field('title', `Book ${Date.now()}`)
                .field('isbn', `978${Date.now().toString().slice(-10)}`)
                .field('year', 2024)
                .field('stock', 10)
                .field('authorId', authorId)
                .field('categoryId', categoryId)
                .attach('coverImage', path.resolve(__dirname, '../../test-image.jpg'));
            expect(res.statusCode).toEqual(401);
            expect(res.body.success).toBe(false);
        }
    });
    it('Should return 200 and book that has been created', async () => {
        // First get author and category IDs
        const authorRes = await request(app).get('/api/authors?limit=1');
        const categoryRes = await request(app).get('/api/categories?limit=1');
        const authorId = authorRes.body.data[0]?.id;
        const categoryId = categoryRes.body?.data?.categories?.[0]?.id;
        if (authorId && categoryId) {
            const res = await request(app)
                .post('/api/books')
                .field('title', `Book ${Date.now()}`)
                .field('isbn', `978${Date.now().toString().slice(-10)}`)
                .field('year', 2024)
                .field('stock', 10)
                .field('authorId', authorId)
                .field('categoryId', categoryId)
                .attach('coverImage', path.resolve(__dirname, '../../absen.jpg'))
                .set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toEqual(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.title).toContain('Book');
        }
    });
});
describe('PUT /api/book/:id', () => {
    const token = jwt.sign({ id: '1', role: 'ADMIN' }, config.JWT_SECRET);
    it('Should return 200 and book that has been updated', async () => {
        // First create a book to update
        const authorRes = await request(app).get('/api/authors?limit=1');
        const categoryRes = await request(app).get('/api/categories?limit=1');
        const authorId = authorRes.body.data[0]?.id;
        const categoryId = categoryRes.body.data?.[0]?.id;
        if (authorId && categoryId) {
            const createRes = await request(app)
                .post('/api/books')
                .field('title', `Book to Update ${Date.now()}`)
                .field('isbn', `978${Date.now().toString().slice(-10)}`)
                .field('year', 2024)
                .field('stock', 10)
                .field('authorId', authorId)
                .field('categoryId', categoryId)
                .attach('coverImage', path.resolve(__dirname, '../../absen.jpg'))
                .set('Authorization', `Bearer ${token}`);
            if (createRes.statusCode !== 200) {
                console.log("Error Body:", JSON.stringify(createRes.body, null, 2));
            }
            if (createRes.statusCode === 201) {
                const bookId = createRes.body.data.id;
                const res = await request(app)
                    .put(`/api/books/${bookId}`)
                    .set('Authorization', `Bearer ${token}`)
                    .field('title', `Updated Book ${Date.now()}`)
                    .field('stock', 20)
                    .attach('coverImage', path.resolve(__dirname, '../../absen.jpg'));
                expect(res.statusCode).toEqual(200);
                expect(res.body.success).toBe(true);
            }
        }
    });
});
//# sourceMappingURL=book.test.js.map