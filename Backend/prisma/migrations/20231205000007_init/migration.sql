-- DropForeignKey
ALTER TABLE "report_requests" DROP CONSTRAINT "report_requests_answeredBy_fkey";

-- AlterTable
ALTER TABLE "report_requests" ALTER COLUMN "answeredBy" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "report_requests" ADD CONSTRAINT "report_requests_answeredBy_fkey" FOREIGN KEY ("answeredBy") REFERENCES "employees"("registration") ON DELETE SET NULL ON UPDATE CASCADE;
