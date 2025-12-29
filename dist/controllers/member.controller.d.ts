import type { Request, Response } from "express";
import type { IMemberService } from "../services/member.service.js";
export interface IMemberController {
    list(req: Request, res: Response): Promise<void>;
    getById(req: Request, res: Response): Promise<void>;
    create(req: Request, res: Response): Promise<void>;
    update(req: Request, res: Response): Promise<void>;
    remove(req: Request, res: Response): Promise<void>;
    getStats(req: Request, res: Response): Promise<void>;
}
export declare class MemberController implements IMemberController {
    private memberService;
    constructor(memberService: IMemberService);
    list(req: Request, res: Response): Promise<void>;
    getById(req: Request, res: Response): Promise<void>;
    create(req: Request, res: Response): Promise<void>;
    update(req: Request, res: Response): Promise<void>;
    remove(req: Request, res: Response): Promise<void>;
    getStats(_req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=member.controller.d.ts.map
