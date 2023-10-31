/*
  Warnings:

  - Added the required column `userRegistration` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "userRegistration" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "profile_data" (
    "registration" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "profile_data_registration_key" ON "profile_data"("registration");

-- CreateIndex
CREATE UNIQUE INDEX "profile_data_email_key" ON "profile_data"("email");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_userRegistration_fkey" FOREIGN KEY ("userRegistration") REFERENCES "profile_data"("registration") ON DELETE RESTRICT ON UPDATE CASCADE;
