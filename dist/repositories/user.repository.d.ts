import type { User, Prisma, PrismaClient, Member } from "../generated/client";
export interface IUserRepository {
    findByEmail(email: string): Promise<User | null>;
    findByUsername(username: string): Promise<User | null>;
    list(skip: number, take: number, where: Prisma.UserWhereInput, orderBy: Prisma.UserOrderByWithRelationInput): Promise<User[]>;
    countAll(where: Prisma.UserWhereInput): Promise<number>;
    findById(id: string): Promise<(User & {
        member: Member[];
    }) | null>;
    create(data: Prisma.UserCreateInput): Promise<User>;
    update(id: string, data: Prisma.UserUpdateInput): Promise<User>;
    delete(id: string): Promise<User>;
}
export declare class UserRepository implements IUserRepository {
    private prisma;
    constructor(prisma: PrismaClient);
    findByEmail(email: string): Promise<User | null>;
    findByUsername(username: string): Promise<User | null>;
    list(skip: number, take: number, where: Prisma.UserWhereInput, orderBy: Prisma.UserOrderByWithRelationInput): Promise<User[]>;
    countAll(where: Prisma.UserWhereInput): Promise<number>;
    findById(id: string): Promise<(User & {
        member: Member[];
    }) | null>;
    create(data: Prisma.UserCreateInput): Promise<User>;
    update(id: string, data: Prisma.UserUpdateInput): Promise<User>;
    delete(id: string): Promise<User>;
}
//# sourceMappingURL=user.repository.d.ts.map