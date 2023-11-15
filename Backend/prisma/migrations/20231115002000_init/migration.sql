-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_coordinatorRegistration_fkey";

-- AlterTable
ALTER TABLE "projects" ALTER COLUMN "coordinatorRegistration" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_coordinatorRegistration_fkey" FOREIGN KEY ("coordinatorRegistration") REFERENCES "employees"("registration") ON DELETE SET NULL ON UPDATE CASCADE;
