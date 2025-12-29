import { getPrisma } from "../prisma";
const prisma = getPrisma();
export const findUserByEmail = async (email) => {
    return await prisma.user.findUnique({
        where: { email }
    });
};
export const createUser = async (data) => {
    return await prisma.user.create({ data });
};
//# sourceMappingURL=auth.repository.js.map