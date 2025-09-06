-- CreateEnum
CREATE TYPE "app"."AuthTokenType" AS ENUM ('EMAIL_VERIFY', 'PASSWORD_RESET');

-- CreateEnum
CREATE TYPE "app"."Role" AS ENUM ('PATIENT', 'DOCTOR', 'ADMIN', 'MODERATOR');

-- CreateEnum
CREATE TYPE "app"."Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER', 'UNSPECIFIED');

-- CreateEnum
CREATE TYPE "app"."AppointmentStatus" AS ENUM ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "app"."OrderStatus" AS ENUM ('DRAFT', 'REQUESTED', 'PROCESSING', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "app"."User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "role" "app"."Role" NOT NULL,
    "passwordHash" TEXT,
    "emailVerifiedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."OtpCode" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "consumedAt" TIMESTAMP(3),
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OtpCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."Patient" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3),
    "gender" "app"."Gender",
    "medicalHistory" JSONB,
    "insuranceNo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."Doctor" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "specialization" TEXT NOT NULL,
    "registrationNo" TEXT,
    "bio" TEXT,
    "branchId" TEXT,
    "availableFrom" TEXT,
    "availableTo" TEXT,
    "weekdays" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Doctor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."Branch" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "postcode" TEXT,
    "country" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "geoLat" DOUBLE PRECISION,
    "geoLng" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Branch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."Appointment" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "patientId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "status" "app"."AppointmentStatus" NOT NULL DEFAULT 'PENDING',
    "reason" TEXT,
    "notes" TEXT,
    "createdByUserId" TEXT,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."TestPrice" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "priceCents" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TestPrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."TestOrder" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "app"."OrderStatus" NOT NULL DEFAULT 'REQUESTED',
    "totalCents" INTEGER NOT NULL DEFAULT 0,
    "patientId" TEXT NOT NULL,
    "doctorId" TEXT,
    "createdByUserId" TEXT,
    "resultFileId" TEXT,

    CONSTRAINT "TestOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."TestOrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "testPriceId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unitPriceCents" INTEGER NOT NULL,
    "lineTotalCents" INTEGER NOT NULL,

    CONSTRAINT "TestOrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."FileAsset" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "bucketKey" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "contentType" TEXT,
    "sizeBytes" INTEGER,
    "ownerUserId" TEXT,
    "patientId" TEXT,

    CONSTRAINT "FileAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."AuditLog" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT,
    "entityId" TEXT,
    "ip" TEXT,
    "userAgent" TEXT,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."AuthToken" (
    "id" TEXT NOT NULL,
    "type" "app"."AuthTokenType" NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "consumedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuthToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "app"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "app"."User"("phone");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "app"."User"("role");

-- CreateIndex
CREATE INDEX "OtpCode_phone_idx" ON "app"."OtpCode"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_userId_key" ON "app"."Patient"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_userId_key" ON "app"."Doctor"("userId");

-- CreateIndex
CREATE INDEX "Branch_city_idx" ON "app"."Branch"("city");

-- CreateIndex
CREATE INDEX "Appointment_patientId_idx" ON "app"."Appointment"("patientId");

-- CreateIndex
CREATE INDEX "Appointment_doctorId_idx" ON "app"."Appointment"("doctorId");

-- CreateIndex
CREATE INDEX "Appointment_scheduledAt_idx" ON "app"."Appointment"("scheduledAt");

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_doctorId_scheduledAt_key" ON "app"."Appointment"("doctorId", "scheduledAt");

-- CreateIndex
CREATE UNIQUE INDEX "TestPrice_code_key" ON "app"."TestPrice"("code");

-- CreateIndex
CREATE INDEX "TestPrice_active_idx" ON "app"."TestPrice"("active");

-- CreateIndex
CREATE INDEX "TestPrice_name_idx" ON "app"."TestPrice"("name");

-- CreateIndex
CREATE INDEX "TestOrder_patientId_idx" ON "app"."TestOrder"("patientId");

-- CreateIndex
CREATE INDEX "TestOrder_doctorId_idx" ON "app"."TestOrder"("doctorId");

-- CreateIndex
CREATE INDEX "TestOrder_status_idx" ON "app"."TestOrder"("status");

-- CreateIndex
CREATE INDEX "TestOrderItem_orderId_idx" ON "app"."TestOrderItem"("orderId");

-- CreateIndex
CREATE INDEX "TestOrderItem_testPriceId_idx" ON "app"."TestOrderItem"("testPriceId");

-- CreateIndex
CREATE UNIQUE INDEX "FileAsset_bucketKey_key" ON "app"."FileAsset"("bucketKey");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "app"."AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_entity_entityId_idx" ON "app"."AuditLog"("entity", "entityId");

-- CreateIndex
CREATE INDEX "AuthToken_userId_type_idx" ON "app"."AuthToken"("userId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "app"."Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "app"."Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "app"."VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "app"."VerificationToken"("identifier", "token");

-- AddForeignKey
ALTER TABLE "app"."Patient" ADD CONSTRAINT "Patient_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."Doctor" ADD CONSTRAINT "Doctor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."Doctor" ADD CONSTRAINT "Doctor_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "app"."Branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."Appointment" ADD CONSTRAINT "Appointment_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "app"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."Appointment" ADD CONSTRAINT "Appointment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "app"."Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."Appointment" ADD CONSTRAINT "Appointment_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "app"."Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."TestPrice" ADD CONSTRAINT "TestPrice_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "app"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."TestOrder" ADD CONSTRAINT "TestOrder_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "app"."Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."TestOrder" ADD CONSTRAINT "TestOrder_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "app"."Doctor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."TestOrder" ADD CONSTRAINT "TestOrder_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "app"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."TestOrder" ADD CONSTRAINT "TestOrder_resultFileId_fkey" FOREIGN KEY ("resultFileId") REFERENCES "app"."FileAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."TestOrderItem" ADD CONSTRAINT "TestOrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "app"."TestOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."TestOrderItem" ADD CONSTRAINT "TestOrderItem_testPriceId_fkey" FOREIGN KEY ("testPriceId") REFERENCES "app"."TestPrice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."FileAsset" ADD CONSTRAINT "FileAsset_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "app"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."FileAsset" ADD CONSTRAINT "FileAsset_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "app"."Patient"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."AuthToken" ADD CONSTRAINT "AuthToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app"."Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "app"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
