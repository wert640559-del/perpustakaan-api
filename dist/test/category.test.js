import app from "../app.js";
import jwt from "jsonwebtoken";
import config from "../utils/env.js";
import request from "supertest";
describe("POST /api/category", () => {
    const token = jwt.sign({ id: "1", role: "ADMIN" }, config.JWT_SECRET);
    it("Should return 401 if no token provided", async () => {
        const res = await request(app)
            .post("/api/categories")
            .send({
            name: `New Category ${Date.now()}`,
            description: "Test description"
        });
        expect(res.statusCode).toEqual(401);
        expect(res.body.success).toBe(false);
    });
    it("Should return 200 and category that has been created", async () => {
        const res = await request(app)
            .post("/api/categories")
            .send({
            name: `New Category ${Date.now()}`,
            description: "Test description"
        })
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toEqual(201);
        expect(res.body.success).toBe(true);
    });
});
//# sourceMappingURL=category.test.js.map
