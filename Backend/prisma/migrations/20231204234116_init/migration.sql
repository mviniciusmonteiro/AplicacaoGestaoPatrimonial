/*
  Warnings:

  - Made the column `coordinatorRegistration` on table `projects` required. This step will fail if there are existing NULL values in that column.
  - Made the column `requestedBy` on table `report_requests` required. This step will fail if there are existing NULL values in that column.
  - Made the column `answeredBy` on table `report_requests` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_coordinatorRegistration_fkey";

-- DropForeignKey
ALTER TABLE "report_requests" DROP CONSTRAINT "report_requests_answeredBy_fkey";

-- DropForeignKey
ALTER TABLE "report_requests" DROP CONSTRAINT "report_requests_requestedBy_fkey";

-- AlterTable
ALTER TABLE "projects" ALTER COLUMN "coordinatorRegistration" SET NOT NULL;

-- AlterTable
ALTER TABLE "report_requests" ALTER COLUMN "requestedBy" SET NOT NULL,
ALTER COLUMN "answeredBy" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_coordinatorRegistration_fkey" FOREIGN KEY ("coordinatorRegistration") REFERENCES "employees"("registration") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_requests" ADD CONSTRAINT "report_requests_requestedBy_fkey" FOREIGN KEY ("requestedBy") REFERENCES "employees"("registration") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_requests" ADD CONSTRAINT "report_requests_answeredBy_fkey" FOREIGN KEY ("answeredBy") REFERENCES "employees"("registration") ON DELETE RESTRICT ON UPDATE CASCADE;
