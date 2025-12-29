import { successResponse } from "../utils/response.js";
import { register, login, getProfile } from "../services/auth.service.js";
export const registerUser = async (req, res) => {
    const { username, email, password, name, role } = req.body;
    // Validasi input
    if (!username || !email || !password || !name) {
        throw new Error("Username, email, password, dan nama wajib diisi");
    }
    // Validasi email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error("Format email tidak valid");
    }
    // Validasi password minimal 6 karakter
    if (password.length < 6) {
        throw new Error("Password minimal 6 karakter");
    }
    // Validasi role
    const validRoles = ["ADMIN", "LIBRARIAN", "MEMBER"];
    if (role && !validRoles.includes(role)) {
        throw new Error("Role harus ADMIN, LIBRARIAN, atau MEMBER");
    }
    const result = await register({
        username: String(username),
        email: String(email),
        password: String(password),
        name: String(name),
        role: role,
    });
    successResponse(res, "Registrasi berhasil", result, null, 201);
};
export const loginUser = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        throw new Error("Username dan password wajib diisi");
    }
    const result = await login({
        username: String(username),
        password: String(password),
    });
    successResponse(res, "Login berhasil", result);
};
export const profile = async (req, res) => {
    if (!req.user) {
        throw new Error("User tidak terautentikasi");
    }
    const userProfile = await getProfile(req.user.id);
    successResponse(res, "Profil berhasil diambil", userProfile);
};
export const logout = async (_req, res) => {
    successResponse(res, "Logout berhasil", null);
};
//# sourceMappingURL=auth.controller.js.map
