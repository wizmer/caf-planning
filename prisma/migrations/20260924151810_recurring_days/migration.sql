-- CreateTable
CREATE TABLE "recurring_days" (
    "weekday" INTEGER NOT NULL,
    "start" INTEGER NOT NULL,
    "end" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "recurring_days_pkey" PRIMARY KEY ("weekday")
);

-- Seed: lun/mar/mer/ven/sam actifs avec les horaires actuels, jeu/dim inactifs
INSERT INTO "recurring_days" ("weekday", "start", "end", "active") VALUES
    (1, 18, 22, true),
    (2, 18, 22, true),
    (3, 20, 22, true),
    (4, 18, 22, false),
    (5, 18, 22, true),
    (6, 9, 13, true),
    (7, 18, 22, false);
