-- Align existing Neon schema with Prisma schema expectations

-- CmsPage table and metadata
CREATE TABLE IF NOT EXISTS "app"."CmsPage" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "excerpt" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT FALSE,
    "authorId" TEXT NOT NULL,
    CONSTRAINT "CmsPage_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "CmsPage_slug_key" ON "app"."CmsPage" ("slug");
CREATE INDEX IF NOT EXISTS "CmsPage_published_idx" ON "app"."CmsPage" ("published");

ALTER TABLE "app"."CmsPage"
    ADD CONSTRAINT "CmsPage_authorId_fkey"
    FOREIGN KEY ("authorId") REFERENCES "app"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Doctor table extended fields
ALTER TABLE "app"."Doctor"
    ADD COLUMN IF NOT EXISTS "department" TEXT NOT NULL DEFAULT '';

ALTER TABLE "app"."Doctor"
    ADD COLUMN IF NOT EXISTS "sliderPictureUrl" TEXT;

ALTER TABLE "app"."Doctor"
    ADD COLUMN IF NOT EXISTS "schedule" TEXT;

ALTER TABLE "app"."Doctor"
    ADD COLUMN IF NOT EXISTS "visitingHours" TEXT;

ALTER TABLE "app"."Doctor"
    ADD COLUMN IF NOT EXISTS "keywords" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

UPDATE "app"."Doctor"
SET "keywords" = ARRAY[]::TEXT[]
WHERE "keywords" IS NULL;

ALTER TABLE "app"."Doctor"
    ADD COLUMN IF NOT EXISTS "directoryProfile" JSONB;

ALTER TABLE "app"."Doctor"
    ADD COLUMN IF NOT EXISTS "availableFrom" TEXT;

ALTER TABLE "app"."Doctor"
    ADD COLUMN IF NOT EXISTS "availableTo" TEXT;

ALTER TABLE "app"."Doctor"
    ADD COLUMN IF NOT EXISTS "weekdays" TEXT;
