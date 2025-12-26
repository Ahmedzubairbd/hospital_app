-- Add metadata columns to TestPrice for CSV imports and admin UI
ALTER TABLE "app"."TestPrice"
  ADD COLUMN "examType" TEXT,
  ADD COLUMN "department" TEXT,
  ADD COLUMN "serialNo" TEXT,
  ADD COLUMN "shortName" TEXT,
  ADD COLUMN "deliveryType" TEXT,
  ADD COLUMN "deliveryHour" INTEGER;
