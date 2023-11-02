-- CreateTable
CREATE TABLE "items" (
    "id" SERIAL NOT NULL,
    "numberOfPatrimony" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "localization" TEXT NOT NULL,
    "hasResponsible" BOOLEAN NOT NULL,
    "responsibleRegistration" INTEGER,
    "isOnProject" BOOLEAN NOT NULL,
    "projectName" TEXT,
    "imageId" INTEGER,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "images" (
    "id" SERIAL NOT NULL,
    "fileName" VARCHAR(255) NOT NULL,
    "fileExt" VARCHAR(255) NOT NULL,
    "file" TEXT,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "items_numberOfPatrimony_key" ON "items"("numberOfPatrimony");

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "images"("id") ON DELETE SET NULL ON UPDATE CASCADE;
