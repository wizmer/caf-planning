/*
  Warnings:

  - You are about to drop the `gym` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `wall_photos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `walls` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "wall_photos" DROP CONSTRAINT "wall_photos_wall_id_fkey";

-- DropForeignKey
ALTER TABLE "walls" DROP CONSTRAINT "walls_gym_id_fkey";

-- DropTable
DROP TABLE "gym";

-- DropTable
DROP TABLE "wall_photos";

-- DropTable
DROP TABLE "walls";

-- CreateTable
CREATE TABLE "Gym" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Gym_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wall" (
    "id" SERIAL NOT NULL,
    "gym_id" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wall_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wall_photos" (
    "id" SERIAL NOT NULL,
    "wall_id" INTEGER NOT NULL,
    "file_path" VARCHAR(500) NOT NULL,
    "file_name" VARCHAR(255) NOT NULL,
    "mime_type" VARCHAR(50) NOT NULL,
    "file_size" INTEGER NOT NULL,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Wall_photos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Wall_photos_wall_id_idx" ON "Wall_photos"("wall_id");

-- AddForeignKey
ALTER TABLE "Wall" ADD CONSTRAINT "Wall_gym_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "Gym"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wall_photos" ADD CONSTRAINT "Wall_photos_wall_id_fkey" FOREIGN KEY ("wall_id") REFERENCES "Wall"("id") ON DELETE CASCADE ON UPDATE CASCADE;
