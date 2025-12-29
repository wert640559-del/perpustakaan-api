import jwt from "jsonwebtoken";
import { errorResponse } from "../utils/response.js";
import config from "../utils/env.js";
export const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return errorResponse(res, "Token tidak ditemukan", 401);
    }
    const token = authHeader.split(" ")[1];
    try {
        const payload = jwt.verify(token, config.JWT_SECRET);
        req.user = {
            id: String(payload.id),
            role: payload.role
        };
        next();
    }
    catch (error) {
        console.error("JWT Error:", error);
        return errorResponse(res, "Token tidak valid atau sudah kedaluwarsa", 401);
    }
};
//# sourceMappingURL=auth.middleware.js.map
