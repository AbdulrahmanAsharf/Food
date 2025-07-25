import { PrismaClient } from "@prisma/client"

enum Environments {
  DEV = 'development',
  PROD = 'production',
}

const globalForPrisma = global as unknown as { prisma?: PrismaClient }

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === Environments.DEV
        ? ['query', 'error', 'warn']
        : ['error'],
  })

if (process.env.NODE_ENV !== Environments.PROD) globalForPrisma.prisma = db
