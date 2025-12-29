    import type { User, Prisma, PrismaClient, Member } from "../generated/client";

    export interface IUserRepository {
        // Auth related
        findByEmail(email: string): Promise<User | null>;
        findByUsername(username: string): Promise<User | null>;
        
        // CRUD
        list(
            skip: number,
            take: number,
            where: Prisma.UserWhereInput,
            orderBy: Prisma.UserOrderByWithRelationInput
        ): Promise<User[]>;
        countAll(where: Prisma.UserWhereInput): Promise<number>;
        findById(id: string): Promise<(User & { member: Member[] }) | null>;
        create(data: Prisma.UserCreateInput): Promise<User>;
        update(id: string, data: Prisma.UserUpdateInput): Promise<User>;
        delete(id: string): Promise<User>;
    }

    export class UserRepository implements IUserRepository {
        constructor(private prisma: PrismaClient) { }

        async findByEmail(email: string): Promise<User | null> {
            return await this.prisma.user.findUnique({
                where: { email }
            });
        }

        async findByUsername(username: string): Promise<User | null> {
            return await this.prisma.user.findUnique({
                where: { username }
            });
        }

        async list(
            skip: number,
            take: number,
            where: Prisma.UserWhereInput,
            orderBy: Prisma.UserOrderByWithRelationInput
        ): Promise<User[]> {
            return await this.prisma.user.findMany({
                skip,
                take,
                where,
                orderBy,
                include: {
                    member: true // Melihat data profil member terkait
                }
            });
        }

        async countAll(where: Prisma.UserWhereInput): Promise<number> {
            return await this.prisma.user.count({ where });
        }

        async findById(id: string): Promise<(User & { member: Member[] }) | null> {
            return await this.prisma.user.findUnique({
                where: { id },
                include: {
                    member: true
                }
            }) as (User & { member: Member[] }) | null;
        }

        async create(data: Prisma.UserCreateInput): Promise<User> {
            return await this.prisma.user.create({ 
                data 
            });
        }

        async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
            return await this.prisma.user.update({
                where: { id },
                data
            });
        }

        async delete(id: string): Promise<User> {
            return await this.prisma.user.delete({
                where: { id }
            });
        }
    }