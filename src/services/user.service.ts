import type { User, Prisma } from "../generated/client";
import type { IUserRepository } from "../repositories/user.repository"; 
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";  // Import default, bukan * as
import config from "../utils/env";  // Gunakan config dari env

interface AuthResponse {
    user: Omit<User, "password">;
    token: string;
}

export interface IAuthService {
    register(data: Prisma.UserCreateInput): Promise<Omit<User, "password">>;
    login(email: string, password: string): Promise<AuthResponse>;
    me(userId: string): Promise<Omit<User, "password">>;
}

export class AuthService implements IAuthService {
    constructor(private userRepo: IUserRepository) {}

    async register(data: Prisma.UserCreateInput): Promise<Omit<User, "password">> {
        // 1. Cek duplikasi email
        const existingEmail = await this.userRepo.findByEmail(data.email);
        if (existingEmail) {
            throw new Error("Email sudah digunakan");
        }

        // 2. Cek duplikasi username
        const existingUsername = await this.userRepo.findByUsername(data.username);
        if (existingUsername) {
            throw new Error("Username sudah digunakan");
        }

        // 3. Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(data.password, salt);

        // 4. Simpan ke Database (SAMA dengan product API)
        const user = await this.userRepo.create({
            ...data,
            password: hashedPassword
        });

        // 5. Hilangkan password dari return object
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async login(email: string, passwordInput: string): Promise<AuthResponse> {
        // 1. Cari user
        const user = await this.userRepo.findByEmail(email);
        if (!user) {
            throw new Error("Email atau password salah");
        }

        // 2. Bandingkan password (SAMA dengan product API)
        const isMatch = await bcrypt.compare(passwordInput, user.password);
        if (!isMatch) {
            throw new Error("Email atau password salah");
        }

        // 3. Generate JWT (Pakai config dari env)
        const token = jwt.sign(
            { 
                id: user.id, 
                role: user.role, 
                name: user.name,
                email: user.email 
            },
            config.JWT_SECRET,
            { expiresIn: (config.JWT_EXPIRES_IN as any) || '1d' }
        );

        const { password, ...userWithoutPassword } = user;
        return {
            user: userWithoutPassword,
            token
        };
    }

    async me(userId: string): Promise<Omit<User, "password">> {
        const user = await this.userRepo.findById(userId);
        
        if (!user) {
            throw new Error("User tidak ditemukan");
        }

        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}