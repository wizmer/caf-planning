-- CreateEnum
CREATE TYPE "enum_move_type" AS ENUM ('hand_start', 'foot_start', 'hand', 'foot', 'both', 'finish');

-- CreateTable
CREATE TABLE "moves" (
    "id" SERIAL NOT NULL,
    "route_id" INTEGER NOT NULL,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,
    "type" "enum_move_type" NOT NULL,
    "radius" DOUBLE PRECISION NOT NULL,
    "wall_id" INTEGER NOT NULL,

    CONSTRAINT "moves_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "moves" ADD CONSTRAINT "moves_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "Route"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moves" ADD CONSTRAINT "moves_wall_id_fkey" FOREIGN KEY ("wall_id") REFERENCES "Wall"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- Migrate existing data from Route.body to moves table
INSERT INTO "moves" (route_id, x, y, type, radius, wall_id)
SELECT 
    r.id as route_id,
    (move->>'x')::double precision as x,
    (move->>'y')::double precision as y,
    (move->>'type')::"enum_move_type" as type,
    COALESCE((move->>'radius')::double precision, 1.6) as radius,
    (move->>'wallId')::integer as wall_id
FROM "Route" r,
LATERAL jsonb_array_elements(r.body) AS move
WHERE jsonb_typeof(r.body) = 'array';

-- Scale radii from pixels to percentage (16px -> 1.6%)
UPDATE "moves" SET radius = radius / 10;

