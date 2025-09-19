import { Prisma } from "generated/prisma";


export const returnUserObject: Prisma.UserSelect = {
    id: true,
    email: true,
}