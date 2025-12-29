import type { Request, Response } from "express";
import type { ITransactionService } from "../services/transaction.service";
export interface ITransactionController {
    list(req: Request, res: Response): Promise<void>;
    getById(req: Request, res: Response): Promise<void>;
    create(req: Request, res: Response): Promise<void>;
    returnBooks(req: Request, res: Response): Promise<void>;
    getStats(req: Request, res: Response): Promise<void>;
}
export declare class TransactionController implements ITransactionController {
    private transactionService;
    constructor(transactionService: ITransactionService);
    list(req: Request, res: Response): Promise<void>;
    getById(req: Request, res: Response): Promise<void>;
    create(req: Request, res: Response): Promise<void>;
    /**
     * Fitur khusus Library: Pengembalian Buku
     */
    returnBooks(req: Request, res: Response): Promise<void>;
    getStats(_req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=transaction.controller.d.ts.map