/*
  Warnings:

  - A unique constraint covering the columns `[certificateId]` on the table `certificate_files` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "certificate_files" DROP CONSTRAINT "certificate_files_certificateId_fkey";

-- AlterTable
ALTER TABLE "certificate_files" ALTER COLUMN "certificateId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "certificate_files_certificateId_key" ON "certificate_files"("certificateId");

-- AddForeignKey
ALTER TABLE "certificate_files" ADD CONSTRAINT "certificate_files_certificateId_fkey" FOREIGN KEY ("certificateId") REFERENCES "certificates"("id") ON DELETE SET NULL ON UPDATE CASCADE;
