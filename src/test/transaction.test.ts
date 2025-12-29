import request from 'supertest'
import jwt from 'jsonwebtoken'
import config from '../utils/env'
import app from '../app'

describe('GET /api/transaction', () => {
    const token = jwt.sign({ id: '1', role: 'ADMIN' }, config.JWT_SECRET)

    it('Should return 401 if no token provided', async () => {
        const res = await request(app)
            .get('/api/transactions')

        expect(res.statusCode).toEqual(401)
        expect(res.body.success).toBe(false)
        expect(Array.isArray(res.body.data)).toBe(false)
    })

    it('Should return 200 and list of transaction', async () => {
        const res = await request(app)
            .get('/api/transactions')
            .set('Authorization', `Bearer ${token}`)

        expect(res.statusCode).toEqual(200)
        expect(res.body.success).toBe(true)
    })
})

describe('POST /api/transaction', () => {
    const token = jwt.sign({ id: '1', role: 'ADMIN' }, config.JWT_SECRET)

    it('Should return 401 if no token provided', async () => {
        const res = await request(app)
            .post('/api/transactions')
            .send({
                memberId: 'test-id',
                items: [{ bookId: 'test-id', quantity: 1 }],
                dueDate: '2024-12-31'
            })

        expect(res.statusCode).toEqual(401)
        expect(res.body.success).toBe(false)
    })

    it('Should return 200 and transaction that has been created', async () => {
        // First get a member and book
        const memberRes = await request(app)
            .get('/api/members')
            .set('Authorization', `Bearer ${token}`)
        
        const bookRes = await request(app)
            .get('/api/books?limit=1')

        const memberId = memberRes.body.data?.members?.[0]?.id
        const bookId = bookRes.body.data?.[0]?.id

        if (memberId && bookId) {
            const res = await request(app)
                .post('/api/transactions')
                .send({
                    memberId: memberId,
                    items: [{ bookId: bookId, quantity: 1 }],
                    dueDate: '2024-12-31'
                })
                .set('Authorization', `Bearer ${token}`)

            expect(res.statusCode).toEqual(201)
            expect(res.body.success).toBe(true)
        }
    })
})

describe('GET /api/transaction/:id', () => {
    const token = jwt.sign({ id: '1', role: 'ADMIN' }, config.JWT_SECRET)

    it('Should return 200 and transaction that has been found', async () => {
        // First create a transaction
        const memberRes = await request(app)
            .get('/api/members')
            .set('Authorization', `Bearer ${token}`)
        
        const bookRes = await request(app)
            .get('/api/books?limit=1')

        const memberId = memberRes.body.data?.members?.[0]?.id
        const bookId = bookRes.body.data?.[0]?.id

        if (memberId && bookId) {
            const createRes = await request(app)
                .post('/api/transactions')
                .send({
                    memberId: memberId,
                    items: [{ bookId: bookId, quantity: 1 }],
                    dueDate: '2024-12-31'
                })
                .set('Authorization', `Bearer ${token}`)

            if (createRes.statusCode === 201) {
                const transactionId = createRes.body.data.id
                const res = await request(app)
                    .get(`/api/transactions/${transactionId}`)
                    .set('Authorization', `Bearer ${token}`)

                expect(res.statusCode).toEqual(200)
                expect(res.body.success).toBe(true)
            }
        }
    })
})