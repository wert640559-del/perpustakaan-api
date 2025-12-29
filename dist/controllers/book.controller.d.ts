import type { Request, Response } from "express";
import type { IBookService } from "../services/book.service.js";
export interface IBookController {
    list(req: Request, res: Response): Promise<void>;
    getById(req: Request, res: Response): Promise<void>;
    create(req: Request, res: Response): Promise<void>;
    update(req: Request, res: Response): Promise<void>;
    remove(req: Request, res: Response): Promise<void>;
    getStats(req: Request, res: Response): Promise<void>;
}
export declare class BookController implements IBookController {
    private bookService;
    constructor(bookService: IBookService);
    list(req: Request, res: Response): Promise<void>;
    getById(req: Request, res: Response): Promise<void>;
    create(req: Request, res: Response): Promise<void>;
    update(req: Request, res: Response): Promise<void>;
    remove(req: Request, res: Response): Promise<void>;
    getStats(_req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=book.controller.d.ts.map
