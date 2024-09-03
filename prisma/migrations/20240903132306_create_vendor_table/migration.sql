-- CreateTable
CREATE TABLE "VendorOwner" (
    "vendorId" BIGSERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VendorOwner_pkey" PRIMARY KEY ("vendorId")
);

-- CreateTable
CREATE TABLE "VendorOrganization" (
    "orgId" BIGSERIAL NOT NULL,
    "vendorOwnerId" BIGINT NOT NULL,
    "businessName" TEXT NOT NULL,
    "gstin" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "pincode" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VendorOrganization_pkey" PRIMARY KEY ("orgId")
);

-- CreateIndex
CREATE UNIQUE INDEX "VendorOwner_userId_key" ON "VendorOwner"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VendorOrganization_gstin_key" ON "VendorOrganization"("gstin");

-- CreateIndex
CREATE UNIQUE INDEX "VendorOrganization_email_key" ON "VendorOrganization"("email");

-- AddForeignKey
ALTER TABLE "VendorOwner" ADD CONSTRAINT "VendorOwner_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorOrganization" ADD CONSTRAINT "VendorOrganization_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorOrganization" ADD CONSTRAINT "VendorOrganization_vendorOwnerId_fkey" FOREIGN KEY ("vendorOwnerId") REFERENCES "VendorOwner"("vendorId") ON DELETE RESTRICT ON UPDATE CASCADE;
