import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as userRepo from "../repositories/user.repository.js";
import * as memberRepo from "../repositories/member.repository.js";
const JWT_SECRET = process.env.JWT_SECRET || "library_secret_key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
export const register = async (data) => {
    const existingUser = await userRepo.findByUsernameOrEmail(data.username, data.email);
    if (existingUser) {
        throw new Error("Username atau email sudah terdaftar");
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await userRepo.create({
        username: data.username,
        email: data.email,
        password: hashedPassword,
        name: data.name,
        role: data.role || "LIBRARIAN",
    });
    let memberId;
    if (data.role === "MEMBER") {
        const member = await memberRepo.create({
            kodeMember: `MEM${Date.now().toString().slice(-6)}`,
            nama: data.name,
            email: data.email,
            telepon: "-",
            userId: user.id,
        });
        memberId = member.id;
    }
    const token = jwt.sign({
        id: user.id,
        username: user.username,
        role: user.role,
        memberId: memberId,
    }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    const { password, ...userWithoutPassword } = user;
    return {
        user: userWithoutPassword,
        token,
        memberId,
    };
};
export const login = async (data) => {
    const user = await userRepo.findByUsername(data.username);
    if (!user) {
        throw new Error("Username atau password salah");
    }
    const isValidPassword = await bcrypt.compare(data.password, user.password);
    if (!isValidPassword) {
        throw new Error("Username atau password salah");
    }
    let memberId;
    if (user.role === "MEMBER") {
        const member = await memberRepo.findByEmail(user.email);
        memberId = member?.id;
    }
    const token = jwt.sign({
        id: user.id,
        username: user.username,
        role: user.role,
        memberId: memberId,
    }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    const { password, ...userWithoutPassword } = user;
    return {
        user: userWithoutPassword,
        token,
        memberId,
    };
};
export const getProfile = async (userId) => {
    const user = await userRepo.findById(userId, {
        member: {
            select: {
                id: true,
                kodeMember: true,
                nama: true,
                status: true,
            }
        }
    });
    if (!user) {
        throw new Error("User tidak ditemukan");
    }
    return user;
};
//# sourceMappingURL=auth.service.js.map
