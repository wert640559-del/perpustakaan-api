import { successResponse } from "../utils/response";
import { UserRole } from "../generated/enums";
export class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
        // Binding methods SAMA dengan product API
        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
        this.me = this.me.bind(this);
    }
    async register(req, res) {
        const { username, name, email, password, role } = req.body;
        let userRole = UserRole.MEMBER; // Default value
        if (role) {
            if (Object.values(UserRole).includes(role)) {
                userRole = role;
            }
            else {
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
        successResponse(res, "Registrasi berhasil", user, null, 201);
    }
    async login(req, res) {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new Error("Email dan password wajib diisi");
        }
        const result = await this.authService.login(String(email), String(password));
        successResponse(res, "Login berhasil", result);
    }
    async me(req, res) {
        // Mengikuti pola product API: (req as any).user?.id
        const userId = req.user?.id;
        if (!userId) {
            throw new Error("Unauthorized: Sesi tidak ditemukan");
        }
        const user = await this.authService.me(String(userId));
        successResponse(res, "Data profil user berhasil diambil", user);
    }
}
//# sourceMappingURL=user.controller.js.map