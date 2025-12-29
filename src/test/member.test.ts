import jwt from 'jsonwebtoken'
import config from '../utils/env'
import request from 'supertest'
import app from '../app'

describe('GET /api/member', () => {
    const token = jwt.sign({ id: '1', role: 'ADMIN' }, config.JWT_SECRET)

    it('Should return 200 and list of member', async () => {
        const res = await request(app)
            .get('/api/members')
            .set('Authorization', `Bearer ${token}`)

        expect(res.statusCode).toEqual(200)
        expect(res.body.success).toBe(true)
    })
})

describe('GET /api/member/stats', () => {
    const token = jwt.sign({ id: '1', role: 'ADMIN' }, config.JWT_SECRET)

    it('Should return 401 if no token provided', async () => {
        const res = await request(app)
            .get('/api/members/stats')

        expect(res.statusCode).toEqual(401)
        expect(res.body.success).toBe(false)
    })

    it('Should return 200 and member statistic has been found', async () => {
        const res = await request(app)
            .get('/api/members/stats')
            .set('Authorization', `Bearer ${token}`)

        expect(res.statusCode).toEqual(200)
        expect(res.body.success).toBe(true)
    })
})

describe('POST /api/member', () => {
    const token = jwt.sign({ id: '1', role: 'ADMIN' }, config.JWT_SECRET)

    it('Should return 401 if no token provided', async () => {
        const res = await request(app)
            .post('/api/members')
            .send({
                kodeMember: 'TEST001',
                nama: 'Test Member',
                email: 'test@example.com',
                telepon: '081234567890'
            })

        expect(res.statusCode).toEqual(401)
        expect(res.body.success).toBe(false)
    })

    it('Should return 200 and member that has been created', async () => {
        const uniqueEmail = `test${Date.now()}@example.com`
        const res = await request(app)
            .post('/api/members')
            .send({
                kodeMember: `TEST${Date.now()}`,
                nama: 'Test Member',
                email: uniqueEmail,
                telepon: '081234567890'
            })
            .set('Authorization', `Bearer ${token}`)

        expect(res.statusCode).toEqual(201)
        expect(res.body.success).toBe(true)
    })
})

describe('GET /api/member/:id', () => {
    // Pastikan ID ini ada di database dummy/mocking Anda
    const targetId = '1'; 
    const token = jwt.sign({ id: '1', role: 'ADMIN' }, config.JWT_SECRET);

    it('Should return 401 if no token provided', async () => {
        const res = await request(app)
            .get(`/api/member/${targetId}`); // Gunakan singular sesuai route

        expect(res.statusCode).toEqual(401);
        expect(res.body.success).toBe(false);
    });

    it('Should return 200 and member that has been found', async () => {
        const res = await request(app)
            .get(`/api/member/${targetId}`) // Tambahkan ID di sini!
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toBeDefined();
        expect(res.body.data.id).toBe(targetId);
    });

    it('Should return 404 if member not found', async () => {
        const res = await request(app)
            .get('/api/member/99999') // ID yang tidak ada
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(404);
        expect(res.body.success).toBe(false);
    });
});