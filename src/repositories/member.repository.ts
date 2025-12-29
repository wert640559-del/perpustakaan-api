import type { Member, Prisma, PrismaClient, User } from "../generated/client";

export interface IMemberRepository {
    list(
        skip: number,
        take: number,
        where: Prisma.MemberWhereInput,
        orderBy: Prisma.MemberOrderByWithRelationInput
    ): Promise<Member[]>;
    countAll(where: Prisma.MemberWhereInput): Promise<number>;
    findById(id: string): Promise<User | null & Member | null>;
    findByUserId(userId: string): Promise<Member | null>;
    findByKodeMember(kodeMember: string): Promise<Member | null>;
    create(data: Prisma.MemberCreateInput): Promise<Member>;
    update(id: string, data: Prisma.MemberUpdateInput): Promise<Member>;
    // Karena di skema Member belum ada deletedAt, kita akan simulasi atau 
    // Anda bisa menambahkannya nanti di Prisma schema.
    softDelete(id: string): Promise<Member>;
    
    // Statistik berdasarkan status member (ACTIVE, INACTIVE, SUSPENDED)
    getStatusStats(): Promise<(Prisma.PickEnumerable<Prisma.MemberGroupByOutputType, "status"[]> & {
        _count: {
            id: number;
        };
    })[]>;
}

export class MemberRepository implements IMemberRepository {
    constructor(private prisma: PrismaClient) { }

    async list(
        skip: number,
        take: number,
        where: Prisma.MemberWhereInput,
        orderBy: Prisma.MemberOrderByWithRelationInput
    ): Promise<Member[]> {
        return await this.prisma.member.findMany({
            skip,
            take,
            where: {
                ...where,
                // Catatan: Pastikan menambahkan deletedAt di schema Member jika ingin menggunakan ini
                // deletedAt: null 
            },
            orderBy,
            include: { user: true }
        });
    }

    async countAll(where: Prisma.MemberWhereInput): Promise<number> {
        return await this.prisma.member.count({
            where: {
                ...where,
                // deletedAt: null
            }
        });
    }

    async findById(id: string): Promise<User | null & Member | null> {
        return await this.prisma.member.findUnique({
            where: {
                id,
                // deletedAt: null,
            },
            include: {
                user: true
            }
        }) as any;
    }

    async findByUserId(userId: string): Promise<Member | null> {
        return await this.prisma.member.findFirst({
            where: { 
                userId: userId,
                // deletedAt: null 
            }
        });
    }

    async findByKodeMember(kodeMember: string): Promise<Member | null> {
        return await this.prisma.member.findUnique({
            where: { kodeMember }
        });
    }

    async create(data: Prisma.MemberCreateInput): Promise<Member> {
        return await this.prisma.member.create({ data });
    }

    async update(id: string, data: Prisma.MemberUpdateInput): Promise<Member> {
        return await this.prisma.member.update({
            where: { id },
            data
        });
    }

    async softDelete(id: string): Promise<Member> {
        // Jika belum ada deletedAt di Prisma, Anda bisa mengubah status menjadi INACTIVE
        return await this.prisma.member.update({
            where: { id },
            data: {
                status: 'INACTIVE'
                // deletedAt: new Date() // Gunakan ini jika sudah ada di schema
            }
        });
    }

    async getStatusStats() {
        return await this.prisma.member.groupBy({
            by: ['status'],
            // where: { deletedAt: null },
            _count: { id: true }
        });
    }
}