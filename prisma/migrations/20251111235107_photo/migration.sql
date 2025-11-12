/*
  Warnings:

  - You are about to drop the `Wall_photos` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Wall_photos" DROP CONSTRAINT "Wall_photos_wall_id_fkey";

-- AlterTable
ALTER TABLE "Wall" ADD COLUMN     "photo_id" INTEGER;

-- DropTable
DROP TABLE "Wall_photos";

-- CreateTable
CREATE TABLE "Photo" (
    "id" SERIAL NOT NULL,
    "wall_id" INTEGER NOT NULL,
    "file_path" VARCHAR(500) NOT NULL,
    "file_name" VARCHAR(255) NOT NULL,
    "mime_type" VARCHAR(50) NOT NULL,
    "file_size" INTEGER NOT NULL,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Photo_wall_id_idx" ON "Photo"("wall_id");

-- AddForeignKey
ALTER TABLE "Wall" ADD CONSTRAINT "Wall_photo_id_fkey" FOREIGN KEY ("photo_id") REFERENCES "Photo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
