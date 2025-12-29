import type { Request, Response } from "express";
import { successResponse } from "../utils/response";
import type { IAuthService } from "../services/user.service";
import { UserRole } from "../generated/enums";

export interface IAuthController {
    register(req: Request, res: Response): Promise<void>;
    login(req: Request, res: Response): Promise<void>;
    me(req: Request, res: Response): Promise<void>;
}

export class AuthController implements IAuthController {
    constructor(private authService: IAuthService) {
        // Binding methods SAMA dengan product API
        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
        this.me = this.me.bind(this);
    }

    async register(req: Request, res: Response) {
        const { username, name, email, password, role } = req.body;

        let userRole: UserRole = UserRole.MEMBER; // Default value

        if (role) {
            if (Object.values(UserRole).includes(role as UserRole)) {
                userRole = role as UserRole;
            } else {
                throw new Error("Role tidak valid");
            }
        }
        // Validasi input minimal
        if (!username || !name || !email || !password) {
            throw new Error("Username, Nama, Email, dan Password wajib diisi");
        }

        const user = await this.authService.register({
            username: String(username),
            name: String(name),
            email: String(email),
            password: String(password),
            role: userRole
        });

        successResponse(
            res, 
            "Registrasi berhasil", 
            user, 
            null, 
            201
        );
    }

    async login(req: Request, res: Response) {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new Error("Email dan password wajib diisi");
        }

        const result = await this.authService.login(
            String(email), 
            String(password)
        );

        successResponse(
            res, 
            "Login berhasil", 
            result
        );
    }

    async me(req: Request, res: Response) {
        // Mengikuti pola product API: (req as any).user?.id
        const userId = (req as any).user?.id;

        if (!userId) {
            throw new Error("Unauthorized: Sesi tidak ditemukan");
        }

        const user = await this.authService.me(String(userId));

        successResponse(
            res, 
            "Data profil user berhasil diambil", 
            user
        );
    }
}