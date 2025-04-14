/*
  Warnings:

  - You are about to drop the `_ExtrasToProduct` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProductToSize` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `Productid` to the `Extras` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productid` to the `Size` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ExtrasToProduct" DROP CONSTRAINT "_ExtrasToProduct_A_fkey";

-- DropForeignKey
ALTER TABLE "_ExtrasToProduct" DROP CONSTRAINT "_ExtrasToProduct_B_fkey";

-- DropForeignKey
ALTER TABLE "_ProductToSize" DROP CONSTRAINT "_ProductToSize_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductToSize" DROP CONSTRAINT "_ProductToSize_B_fkey";

-- AlterTable
ALTER TABLE "Extras" ADD COLUMN     "Productid" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Size" ADD COLUMN     "productid" TEXT NOT NULL;

-- DropTable
DROP TABLE "_ExtrasToProduct";

-- DropTable
DROP TABLE "_ProductToSize";

-- AddForeignKey
ALTER TABLE "Size" ADD CONSTRAINT "Size_productid_fkey" FOREIGN KEY ("productid") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Extras" ADD CONSTRAINT "Extras_Productid_fkey" FOREIGN KEY ("Productid") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
