/*
  Warnings:

  - You are about to drop the column `categoryId` on the `certificates` table. All the data in the column will be lost.
  - You are about to drop the `certificate_categories` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "certificates" DROP CONSTRAINT "certificates_categoryId_fkey";

-- AlterTable
ALTER TABLE "certificates" DROP COLUMN "categoryId",
ADD COLUMN     "routeId" TEXT;

-- DropTable
DROP TABLE "certificate_categories";

-- CreateTable
CREATE TABLE "certificate_routes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "certificate_routes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "certificate_routes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
