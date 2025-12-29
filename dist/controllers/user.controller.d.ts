import type { Request, Response } from "express";
import type { IAuthService } from "../services/user.service.js";
export interface IAuthController {
    register(req: Request, res: Response): Promise<void>;
    login(req: Request, res: Response): Promise<void>;
    me(req: Request, res: Response): Promise<void>;
}
export declare class AuthController implements IAuthController {
    private authService;
    constructor(authService: IAuthService);
    register(req: Request, res: Response): Promise<void>;
    login(req: Request, res: Response): Promise<void>;
    me(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=user.controller.d.ts.map
