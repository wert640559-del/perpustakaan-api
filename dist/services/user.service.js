import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; // Import default, bukan * as
import config from "../utils/env.js"; // Gunakan config dari env
export class AuthService {
    userRepo;
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    async register(data) {
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
    async login(email, passwordInput) {
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
        const token = jwt.sign({
            id: user.id,
            role: user.role,
            name: user.name,
            email: user.email
        }, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRES_IN || "1d" });
        const { password, ...userWithoutPassword } = user;
        return {
            user: userWithoutPassword,
            token
        };
    }
    async me(userId) {
        const user = await this.userRepo.findById(userId);
        if (!user) {
            throw new Error("User tidak ditemukan");
        }
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}
//# sourceMappingURL=user.service.js.map
