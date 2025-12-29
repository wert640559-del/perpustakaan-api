import type { User, Prisma } from "../generated/client";
import type { IUserRepository } from "../repositories/user.repository";
interface AuthResponse {
    user: Omit<User, "password">;
    token: string;
}
export interface IAuthService {
    register(data: Prisma.UserCreateInput): Promise<Omit<User, "password">>;
    login(email: string, password: string): Promise<AuthResponse>;
    me(userId: string): Promise<Omit<User, "password">>;
}
export declare class AuthService implements IAuthService {
    private userRepo;
    constructor(userRepo: IUserRepository);
    register(data: Prisma.UserCreateInput): Promise<Omit<User, "password">>;
    login(email: string, passwordInput: string): Promise<AuthResponse>;
    me(userId: string): Promise<Omit<User, "password">>;
}
export {};
//# sourceMappingURL=user.service.d.ts.map