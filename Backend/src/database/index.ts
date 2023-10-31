import { PrismaClient } from '@prisma/client';

const database = new PrismaClient({
    log: ["error"]
});

export { database }