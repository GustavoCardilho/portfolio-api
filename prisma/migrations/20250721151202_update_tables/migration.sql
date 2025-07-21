/*
  Warnings:

  - You are about to drop the column `url` on the `certificate_files` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `certificate_routes` table. All the data in the column will be lost.
  - Added the required column `key` to the `certificate_files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `path` to the `certificate_routes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "certificate_files" DROP COLUMN "url",
ADD COLUMN     "key" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "certificate_routes" DROP COLUMN "name",
ADD COLUMN     "path" TEXT NOT NULL;
