import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { errorResponse } from '../utils/response'
import config from "../utils/env"

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return errorResponse(res, "Token tidak ditemukan", 401)
    }

    const token = authHeader.split(" ")[1]

    try {
        const payload = jwt.verify(token!, config.JWT_SECRET) as { 
            id: string; 
            role: string; 
            name?: string 
        };

        req.user = {
            id: String(payload.id),
            role: payload.role
        };

        next();
    } catch (error) {
        console.error("JWT Error:", error);
        return errorResponse(res, "Token tidak valid atau sudah kedaluwarsa", 401);
    }
}