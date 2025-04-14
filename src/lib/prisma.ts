import { Environments } from "@/constants/enums"
import { PrismaClient } from "@prisma/client"
 
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
 
export const db = globalForPrisma.prisma || new PrismaClient()
 
if (process.env.NODE_ENV !== Environments.PROD) globalForPrisma.prisma = db