-- CreateTable
CREATE TABLE "report_requests" (
    "id" SERIAL NOT NULL,
    "requestedBy" INTEGER,
    "answeredBy" INTEGER,
    "description" TEXT NOT NULL,
    "motiveOfRequest" TEXT,
    "solicitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,
    "motiveOfIndefer" TEXT,

    CONSTRAINT "report_requests_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "report_requests" ADD CONSTRAINT "report_requests_requestedBy_fkey" FOREIGN KEY ("requestedBy") REFERENCES "employees"("registration") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_requests" ADD CONSTRAINT "report_requests_answeredBy_fkey" FOREIGN KEY ("answeredBy") REFERENCES "employees"("registration") ON DELETE SET NULL ON UPDATE CASCADE;
