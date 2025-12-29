export interface BorrowItems {
    bookId: number;
    quantity: number;
}
interface FindAllParams {
    page: number;
    limit: number;
    search?: {
        user_name?: string;
        min_total?: number;
        max_total?: number;
    };
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}
interface BorrowListResponse {
    borrows: any[];
    total: number;
    totalPages: number;
    currentPage: number;
}
export declare const borrow: (userId: number, payload: {
    data: BorrowItems[];
}) => Promise<runtime.Types.Utils.JsPromise<R>>;
export declare const getAllBorrows: (params: FindAllParams) => Promise<BorrowListResponse>;
export declare const getBorrowById: (id: string) => Promise<any>;
export declare const updateBorrowStatus: (id: string, status: string) => Promise<any>;
export declare const cancelBorrow: (id: string) => Promise<any>;
export {};
//# sourceMappingURL=borrow.service.d.ts.map