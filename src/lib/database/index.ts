import { PrismaClient } from '@prisma/client';
import { DEV } from '../../config';

declare global {
	var prisma: PrismaClient | undefined;
}

const prismaClient = globalThis.prisma || new PrismaClient();
if (DEV !== 'production') globalThis.prisma = prismaClient;

export default prismaClient;
