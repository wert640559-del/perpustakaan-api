import type { NextFunction, Request, Response } from "express";
export declare const requestIdMiddleware: (req: Request, _res: Response, next: NextFunction) => void;
export declare const timingMiddleware: (req: Request, _res: Response, next: NextFunction) => void;
export declare const apiKeyMiddleware: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=custom.middleware.d.ts.map