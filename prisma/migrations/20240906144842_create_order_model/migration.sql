-- CreateEnum
CREATE TYPE "orderStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'DELIVERED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Orders" (
    "orderid" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "pharmacyOutletId" BIGINT NOT NULL,
    "orgId" BIGINT NOT NULL,
    "orderDate" TIMESTAMP(3) NOT NULL,
    "orderStatus" "orderStatus" NOT NULL DEFAULT 'PENDING',
    "orderDetails" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("orderid")
);

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_pharmacyOutletId_fkey" FOREIGN KEY ("pharmacyOutletId") REFERENCES "PharmacyOutlet"("pharmacyOutletId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "VendorOrganization"("orgId") ON DELETE RESTRICT ON UPDATE CASCADE;
