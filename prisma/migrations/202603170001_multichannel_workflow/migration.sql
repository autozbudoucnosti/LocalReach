ALTER TABLE "Lead" ADD COLUMN "recommendedChannel" TEXT;
ALTER TABLE "Lead" ADD COLUMN "preferredChannel" TEXT;
ALTER TABLE "Lead" ADD COLUMN "firstContactChannel" TEXT;
ALTER TABLE "Lead" ADD COLUMN "channelReason" TEXT;
ALTER TABLE "Lead" ADD COLUMN "contactStatus" TEXT;
ALTER TABLE "Lead" ADD COLUMN "lastChannelUsed" TEXT;
ALTER TABLE "Lead" ADD COLUMN "firstContactAt" DATETIME;
ALTER TABLE "Lead" ADD COLUMN "followUpDueAt" DATETIME;
ALTER TABLE "Lead" ADD COLUMN "nextAction" TEXT;
ALTER TABLE "Lead" ADD COLUMN "nextActionNotes" TEXT;

CREATE INDEX "Lead_recommendedChannel_idx" ON "Lead"("recommendedChannel");
CREATE INDEX "Lead_contactStatus_followUpDueAt_idx" ON "Lead"("contactStatus", "followUpDueAt");
