/*
  Warnings:

  - You are about to drop the column `coordinateRegistration` on the `projects` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `projects` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `coordinatorRegistration` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_coordinateRegistration_fkey";

-- AlterTable
ALTER TABLE "projects" DROP COLUMN "coordinateRegistration",
ADD COLUMN     "coordinatorRegistration" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "projects_name_key" ON "projects"("name");

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_coordinatorRegistration_fkey" FOREIGN KEY ("coordinatorRegistration") REFERENCES "employees"("registration") ON DELETE RESTRICT ON UPDATE CASCADE;
