export declare const register: (data: {
    username: string;
    email: string;
    password: string;
    name: string;
    role?: "ADMIN" | "LIBRARIAN" | "MEMBER";
}) => Promise<any>;
export declare const login: (data: {
    username: string;
    password: string;
}) => Promise<any>;
export declare const getProfile: (userId: string) => Promise<{
    _count: {
        member: number;
    };
    member: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("../generated/enums").MemberStatus;
        email: string;
        kodeMember: string;
        nama: string;
        telepon: string;
        alamat: string | null;
        tanggal_daftar: Date;
        userId: string | null;
    }[];
} & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    role: string;
    username: string;
    email: string;
    password: string;
}>;
//# sourceMappingURL=auth.service.d.ts.map