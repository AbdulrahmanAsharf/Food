/*
  Warnings:

  - Made the column `phone` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `streetAddress` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `postalCode` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `city` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `country` on table `Order` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Order" ALTER COLUMN "phone" SET NOT NULL,
ALTER COLUMN "streetAddress" SET NOT NULL,
ALTER COLUMN "postalCode" SET NOT NULL,
ALTER COLUMN "city" SET NOT NULL,
ALTER COLUMN "country" SET NOT NULL;
