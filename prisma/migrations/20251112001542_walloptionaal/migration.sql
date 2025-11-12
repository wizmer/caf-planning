/*
  Warnings:

  - You are about to drop the column `wall_id` on the `Photo` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[photo_id]` on the table `Wall` will be added. If there are existing duplicate values, this will fail.
  - Made the column `photo_id` on table `Wall` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Wall" DROP CONSTRAINT "Wall_photo_id_fkey";

-- DropIndex
DROP INDEX "Photo_wall_id_idx";

-- AlterTable
ALTER TABLE "Photo" DROP COLUMN "wall_id";

-- AlterTable
ALTER TABLE "Wall" ALTER COLUMN "photo_id" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Wall_photo_id_key" ON "Wall"("photo_id");

-- AddForeignKey
ALTER TABLE "Wall" ADD CONSTRAINT "Wall_photo_id_fkey" FOREIGN KEY ("photo_id") REFERENCES "Photo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
