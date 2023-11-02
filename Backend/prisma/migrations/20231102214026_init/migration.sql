-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_responsibleRegistration_fkey" FOREIGN KEY ("responsibleRegistration") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
