/*
  Warnings:

  - The primary key for the `Address` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `PharmacyOutlet` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `pharmacistOwnerId` on the `PharmacyOutlet` table. All the data in the column will be lost.
  - You are about to drop the column `pharmacyOutletId` on the `PharmacyOutlet` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `PharmacyOutlet` table. All the data in the column will be lost.
  - You are about to drop the column `oAuthId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `provider` on the `User` table. All the data in the column will be lost.
  - The primary key for the `VendorOrganization` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `orgId` on the `VendorOrganization` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `VendorOrganization` table. All the data in the column will be lost.
  - You are about to drop the column `vendorOwnerId` on the `VendorOrganization` table. All the data in the column will be lost.
  - You are about to drop the `OrderItems` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Orders` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Pharmacist` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VendorOwner` table. If the table is not empty, all the data it contains will be lost.
  - The required column `id` was added to the `PharmacyOutlet` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `ownerId` to the `PharmacyOutlet` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `VendorOrganization` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `ownerId` to the `VendorOrganization` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'DELIVERED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH_ON_DELIVERY', 'UPI', 'CARD', 'NET_BANKING', 'CRYPTO');

-- DropForeignKey
ALTER TABLE "OrderItems" DROP CONSTRAINT "OrderItems_orderId_fkey";

-- DropForeignKey
ALTER TABLE "Orders" DROP CONSTRAINT "Orders_orgId_fkey";

-- DropForeignKey
ALTER TABLE "Orders" DROP CONSTRAINT "Orders_pharmacyOutletId_fkey";

-- DropForeignKey
ALTER TABLE "Orders" DROP CONSTRAINT "Orders_userId_fkey";

-- DropForeignKey
ALTER TABLE "Pharmacist" DROP CONSTRAINT "Pharmacist_userId_fkey";

-- DropForeignKey
ALTER TABLE "PharmacyOutlet" DROP CONSTRAINT "PharmacyOutlet_pharmacistOwnerId_fkey";

-- DropForeignKey
ALTER TABLE "PharmacyOutlet" DROP CONSTRAINT "PharmacyOutlet_userId_fkey";

-- DropForeignKey
ALTER TABLE "VendorOrganization" DROP CONSTRAINT "VendorOrganization_userId_fkey";

-- DropForeignKey
ALTER TABLE "VendorOrganization" DROP CONSTRAINT "VendorOrganization_vendorOwnerId_fkey";

-- DropForeignKey
ALTER TABLE "VendorOwner" DROP CONSTRAINT "VendorOwner_userId_fkey";

-- AlterTable
ALTER TABLE "Address" DROP CONSTRAINT "Address_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Address_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Address_id_seq";

-- AlterTable
ALTER TABLE "PharmacyOutlet" DROP CONSTRAINT "PharmacyOutlet_pkey",
DROP COLUMN "pharmacistOwnerId",
DROP COLUMN "pharmacyOutletId",
DROP COLUMN "userId",
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "ownerId" TEXT NOT NULL,
ALTER COLUMN "pincode" SET DATA TYPE TEXT,
ADD CONSTRAINT "PharmacyOutlet_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP COLUMN "oAuthId",
DROP COLUMN "provider",
ADD COLUMN     "isProfileCompleted" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "phoneNumber" DROP NOT NULL;

-- AlterTable
ALTER TABLE "VendorOrganization" DROP CONSTRAINT "VendorOrganization_pkey",
DROP COLUMN "orgId",
DROP COLUMN "userId",
DROP COLUMN "vendorOwnerId",
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "ownerId" TEXT NOT NULL,
ALTER COLUMN "pincode" SET DATA TYPE TEXT,
ADD CONSTRAINT "VendorOrganization_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "OrderItems";

-- DropTable
DROP TABLE "Orders";

-- DropTable
DROP TABLE "Pharmacist";

-- DropTable
DROP TABLE "VendorOwner";

-- DropEnum
DROP TYPE "orderStatus";

-- DropEnum
DROP TYPE "paymentMethod";

-- DropEnum
DROP TYPE "paymentStatus";

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "pharmacyOutletId" TEXT NOT NULL,
    "vendorOrgId" TEXT NOT NULL,
    "orderDate" TIMESTAMP(3) NOT NULL,
    "orderStatus" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paymentMethod" "PaymentMethod" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "brand" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "image" TEXT,
    "unit" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "vendorOrgId" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryItem" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "pharmacyOutletId" TEXT NOT NULL,
    "stock" INTEGER NOT NULL,
    "threshold" INTEGER NOT NULL,
    "expiry" TIMESTAMP(3) NOT NULL,
    "batchNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InventoryItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "VendorOrganization" ADD CONSTRAINT "VendorOrganization_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PharmacyOutlet" ADD CONSTRAINT "PharmacyOutlet_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_pharmacyOutletId_fkey" FOREIGN KEY ("pharmacyOutletId") REFERENCES "PharmacyOutlet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_vendorOrgId_fkey" FOREIGN KEY ("vendorOrgId") REFERENCES "VendorOrganization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_vendorOrgId_fkey" FOREIGN KEY ("vendorOrgId") REFERENCES "VendorOrganization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryItem" ADD CONSTRAINT "InventoryItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryItem" ADD CONSTRAINT "InventoryItem_pharmacyOutletId_fkey" FOREIGN KEY ("pharmacyOutletId") REFERENCES "PharmacyOutlet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
