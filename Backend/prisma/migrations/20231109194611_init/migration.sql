/*
  Warnings:

  - You are about to drop the column `imagePath` on the `items` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "items" DROP COLUMN "imagePath",
ADD COLUMN     "imageName" TEXT;
