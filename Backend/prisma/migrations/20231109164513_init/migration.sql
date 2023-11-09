/*
  Warnings:

  - You are about to drop the column `hasResponsible` on the `items` table. All the data in the column will be lost.
  - You are about to drop the column `imageId` on the `items` table. All the data in the column will be lost.
  - You are about to drop the column `isOnProject` on the `items` table. All the data in the column will be lost.
  - You are about to drop the column `localization` on the `items` table. All the data in the column will be lost.
  - You are about to drop the column `projectName` on the `items` table. All the data in the column will be lost.
  - You are about to drop the column `userRegistration` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `images` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `profile_data` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `locationId` to the `items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `employeeRegistration` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "items" DROP CONSTRAINT "items_imageId_fkey";

-- DropForeignKey
ALTER TABLE "items" DROP CONSTRAINT "items_responsibleRegistration_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_userRegistration_fkey";

-- AlterTable
ALTER TABLE "items" DROP COLUMN "hasResponsible",
DROP COLUMN "imageId",
DROP COLUMN "isOnProject",
DROP COLUMN "localization",
DROP COLUMN "projectName",
ADD COLUMN     "imagePath" TEXT,
ADD COLUMN     "locationId" INTEGER NOT NULL,
ADD COLUMN     "projectId" INTEGER;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "userRegistration",
ADD COLUMN     "employeeRegistration" INTEGER NOT NULL;

-- DropTable
DROP TABLE "images";

-- DropTable
DROP TABLE "profile_data";

-- CreateTable
CREATE TABLE "employees" (
    "registration" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "locations" (
    "id" SERIAL NOT NULL,
    "departmentBuilding" TEXT NOT NULL,
    "room" TEXT NOT NULL,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "coordinateRegistration" INTEGER NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "employees_registration_key" ON "employees"("registration");

-- CreateIndex
CREATE UNIQUE INDEX "employees_email_key" ON "employees"("email");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_employeeRegistration_fkey" FOREIGN KEY ("employeeRegistration") REFERENCES "employees"("registration") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_coordinateRegistration_fkey" FOREIGN KEY ("coordinateRegistration") REFERENCES "employees"("registration") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_responsibleRegistration_fkey" FOREIGN KEY ("responsibleRegistration") REFERENCES "employees"("registration") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
