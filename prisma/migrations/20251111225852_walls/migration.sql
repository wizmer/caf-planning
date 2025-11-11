-- CreateTable
CREATE TABLE "gym" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gym_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "walls" (
    "id" SERIAL NOT NULL,
    "gym_id" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "walls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wall_photos" (
    "id" SERIAL NOT NULL,
    "wall_id" INTEGER NOT NULL,
    "file_path" VARCHAR(500) NOT NULL,
    "file_name" VARCHAR(255) NOT NULL,
    "mime_type" VARCHAR(50) NOT NULL,
    "file_size" INTEGER NOT NULL,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wall_photos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "wall_photos_wall_id_idx" ON "wall_photos"("wall_id");

-- AddForeignKey
ALTER TABLE "walls" ADD CONSTRAINT "walls_gym_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "gym"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wall_photos" ADD CONSTRAINT "wall_photos_wall_id_fkey" FOREIGN KEY ("wall_id") REFERENCES "walls"("id") ON DELETE CASCADE ON UPDATE CASCADE;
