import type { Member, Prisma, User } from "../generated/client";
import type { IMemberRepository } from "../repositories/member.repository";
interface FindAllMembersParams {
    page: number;
    limit: number;
    search?: {
        nama?: string;
        email?: string;
        status?: "ACTIVE" | "INACTIVE" | "SUSPENDED";
    };
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
interface MemberListResponse {
    members: Member[];
    total: number;
    totalPages: number;
    currentPage: number;
}
export interface IMemberService {
    list(params: FindAllMembersParams): Promise<MemberListResponse>;
    getById(id: string): Promise<Member & {
        user?: User | null;
    }>;
    create(data: Prisma.MemberCreateInput): Promise<Member>;
    update(id: string, data: Prisma.MemberUpdateInput): Promise<Member>;
    delete(id: string): Promise<Member>;
    getStats(): Promise<any>;
}
export declare class MemberService implements IMemberService {
    private memberRepo;
    constructor(memberRepo: IMemberRepository);
    list(params: FindAllMembersParams): Promise<MemberListResponse>;
    getById(id: string): Promise<Member & {
        user?: User | null;
    }>;
    create(data: Prisma.MemberCreateInput): Promise<Member>;
    update(id: string, data: Prisma.MemberUpdateInput): Promise<Member>;
    delete(id: string): Promise<Member>;
    getStats(): Promise<{
        status: import("../generated/enums").MemberStatus;
        count: number;
    }[]>;
}
export {};
//# sourceMappingURL=member.service.d.ts.map