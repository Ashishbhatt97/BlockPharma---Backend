-- CreateTable
CREATE TABLE "Pharmacist" (
    "id" BIGSERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pharmacist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PharmacyOutlet" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "pincode" INTEGER NOT NULL,
    "pharmacistId" BIGINT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "gstin" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PharmacyOutlet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pharmacist_userId_key" ON "Pharmacist"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PharmacyOutlet_gstin_key" ON "PharmacyOutlet"("gstin");

-- CreateIndex
CREATE UNIQUE INDEX "PharmacyOutlet_email_key" ON "PharmacyOutlet"("email");

-- AddForeignKey
ALTER TABLE "Pharmacist" ADD CONSTRAINT "Pharmacist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PharmacyOutlet" ADD CONSTRAINT "PharmacyOutlet_pharmacistId_fkey" FOREIGN KEY ("pharmacistId") REFERENCES "Pharmacist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
