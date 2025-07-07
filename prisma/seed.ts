import { PrismaClient } from "@prisma/client"
import sampleData from "@/server/db/sample-data"

async function main(){
    const prisma = new PrismaClient()
    await prisma.product.deleteMany({})
    await prisma.product.createMany({data: sampleData.products})
    console.log('seeded database')
}

main()