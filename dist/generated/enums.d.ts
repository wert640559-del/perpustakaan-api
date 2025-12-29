export declare const UserRole: {
    readonly ADMIN: "ADMIN";
    readonly LIBRARIAN: "LIBRARIAN";
    readonly MEMBER: "MEMBER";
};
export type UserRole = (typeof UserRole)[keyof typeof UserRole];
export declare const MemberStatus: {
    readonly ACTIVE: "ACTIVE";
    readonly INACTIVE: "INACTIVE";
    readonly SUSPENDED: "SUSPENDED";
};
export type MemberStatus = (typeof MemberStatus)[keyof typeof MemberStatus];
export declare const TransactionStatus: {
    readonly BORROWED: "BORROWED";
    readonly RETURNED: "RETURNED";
    readonly OVERDUE: "OVERDUE";
    readonly CANCELLED: "CANCELLED";
};
export type TransactionStatus = (typeof TransactionStatus)[keyof typeof TransactionStatus];
//# sourceMappingURL=enums.d.ts.map