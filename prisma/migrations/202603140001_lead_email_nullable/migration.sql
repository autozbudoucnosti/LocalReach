PRAGMA foreign_keys=OFF;

CREATE TABLE "new_Lead" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "businessName" TEXT NOT NULL,
    "contactName" TEXT,
    "email" TEXT,
    "website" TEXT,
    "city" TEXT,
    "niche" TEXT,
    "sourceUrl" TEXT,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "lastContactedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

INSERT INTO "new_Lead" (
    "id",
    "businessName",
    "contactName",
    "email",
    "website",
    "city",
    "niche",
    "sourceUrl",
    "notes",
    "status",
    "lastContactedAt",
    "createdAt",
    "updatedAt"
)
SELECT
    "id",
    "businessName",
    "contactName",
    "email",
    "website",
    "city",
    "niche",
    "sourceUrl",
    "notes",
    "status",
    "lastContactedAt",
    "createdAt",
    "updatedAt"
FROM "Lead";

DROP TABLE "Lead";
ALTER TABLE "new_Lead" RENAME TO "Lead";

CREATE UNIQUE INDEX "Lead_email_key" ON "Lead"("email");
CREATE UNIQUE INDEX "Lead_businessName_website_key" ON "Lead"("businessName", "website");
CREATE INDEX "Lead_businessName_idx" ON "Lead"("businessName");
CREATE INDEX "Lead_status_idx" ON "Lead"("status");
CREATE INDEX "Lead_city_idx" ON "Lead"("city");
CREATE INDEX "Lead_niche_idx" ON "Lead"("niche");

PRAGMA foreign_keys=ON;
