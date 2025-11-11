-- CreateTable
CREATE TABLE "events" (
    "id" SERIAL NOT NULL,
    "day" VARCHAR(10) NOT NULL,
    "type" VARCHAR NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "referents" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,

    CONSTRAINT "referents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "slots" (
    "id" SERIAL NOT NULL,
    "ref_id" INTEGER,
    "day" VARCHAR(10) NOT NULL,
    "start_at" TIME(6) NOT NULL,
    "end_at" TIME(6) NOT NULL,

    CONSTRAINT "slots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "events_day_key" ON "events"("day");

-- CreateIndex
CREATE UNIQUE INDEX "referents_name_key" ON "referents"("name");

-- AddForeignKey
ALTER TABLE "slots" ADD CONSTRAINT "slots_ref_id_fkey" FOREIGN KEY ("ref_id") REFERENCES "referents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

