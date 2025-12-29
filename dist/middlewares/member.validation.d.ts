import type { NextFunction, Request, Response } from "express";
import { type ValidationChain } from "express-validator";
export declare const validate: (validations: ValidationChain[]) => (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export declare const createMemberValidation: ValidationChain[];
export declare const getMemberByIdValidation: ValidationChain[];
//# sourceMappingURL=member.validation.d.ts.map