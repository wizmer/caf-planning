-- CreateTable
CREATE TABLE "Route" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "grade" VARCHAR(10) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "body" TEXT NOT NULL,

    CONSTRAINT "Route_pkey" PRIMARY KEY ("id")
);
