/*
  Warnings:

  - You are about to drop the `_CategoryProducts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CategoryProducts" DROP CONSTRAINT "_CategoryProducts_A_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryProducts" DROP CONSTRAINT "_CategoryProducts_B_fkey";

-- DropTable
DROP TABLE "_CategoryProducts";
