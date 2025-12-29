import type { Member, Prisma, PrismaClient, User } from "../generated/client";
export interface IMemberRepository {
    list(skip: number, take: number, where: Prisma.MemberWhereInput, orderBy: Prisma.MemberOrderByWithRelationInput): Promise<Member[]>;
    countAll(where: Prisma.MemberWhereInput): Promise<number>;
    findById(id: string): Promise<User | null & Member | null>;
    findByUserId(userId: string): Promise<Member | null>;
    findByKodeMember(kodeMember: string): Promise<Member | null>;
    create(data: Prisma.MemberCreateInput): Promise<Member>;
    update(id: string, data: Prisma.MemberUpdateInput): Promise<Member>;
    softDelete(id: string): Promise<Member>;
    getStatusStats(): Promise<(Prisma.PickEnumerable<Prisma.MemberGroupByOutputType, "status"[]> & {
        _count: {
            id: number;
        };
    })[]>;
}
export declare class MemberRepository implements IMemberRepository {
    private prisma;
    constructor(prisma: PrismaClient);
    list(skip: number, take: number, where: Prisma.MemberWhereInput, orderBy: Prisma.MemberOrderByWithRelationInput): Promise<Member[]>;
    countAll(where: Prisma.MemberWhereInput): Promise<number>;
    findById(id: string): Promise<User | null & Member | null>;
    findByUserId(userId: string): Promise<Member | null>;
    findByKodeMember(kodeMember: string): Promise<Member | null>;
    create(data: Prisma.MemberCreateInput): Promise<Member>;
    update(id: string, data: Prisma.MemberUpdateInput): Promise<Member>;
    softDelete(id: string): Promise<Member>;
    getStatusStats(): Promise<(Prisma.PickEnumerable<Prisma.MemberGroupByOutputType, "status"[]> & {
        _count: {
            id: number;
        };
    })[]>;
}
//# sourceMappingURL=member.repository.d.ts.map