import request from 'supertest';
import app from '../app';
describe('POST /api/auth/login', () => {
    it('Should return 200 and a token if credentials are correct', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
            username: 'member1',
            email: 'member1@library.com',
            password: 'member123'
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('token');
    });
    it('Should return 401/400 if password wrong', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'member1@library.com',
            password: 'member123'
        });
        expect(res.statusCode).toBeGreaterThanOrEqual(400);
    });
});
//# sourceMappingURL=auth.test.js.map