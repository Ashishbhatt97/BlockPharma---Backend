/*
  Warnings:

  - The primary key for the `Pharmacist` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Pharmacist` table. All the data in the column will be lost.
  - The primary key for the `PharmacyOutlet` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `PharmacyOutlet` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `PharmacyOutlet` table. All the data in the column will be lost.
  - You are about to drop the column `pharmacistId` on the `PharmacyOutlet` table. All the data in the column will be lost.
  - Added the required column `businessName` to the `PharmacyOutlet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pharmacistOwnerId` to the `PharmacyOutlet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `PharmacyOutlet` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PharmacyOutlet" DROP CONSTRAINT "PharmacyOutlet_pharmacistId_fkey";

-- AlterTable
ALTER TABLE "Pharmacist" DROP CONSTRAINT "Pharmacist_pkey",
DROP COLUMN "id",
ADD COLUMN     "pharmacistId" BIGSERIAL NOT NULL,
ADD CONSTRAINT "Pharmacist_pkey" PRIMARY KEY ("pharmacistId");

-- AlterTable
ALTER TABLE "PharmacyOutlet" DROP CONSTRAINT "PharmacyOutlet_pkey",
DROP COLUMN "id",
DROP COLUMN "name",
DROP COLUMN "pharmacistId",
ADD COLUMN     "businessName" TEXT NOT NULL,
ADD COLUMN     "pharmacistOwnerId" BIGINT NOT NULL,
ADD COLUMN     "pharmacyOutletId" BIGSERIAL NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ADD COLUMN     "website" TEXT,
ADD CONSTRAINT "PharmacyOutlet_pkey" PRIMARY KEY ("pharmacyOutletId");

-- AlterTable
ALTER TABLE "VendorOrganization" ALTER COLUMN "website" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "PharmacyOutlet" ADD CONSTRAINT "PharmacyOutlet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PharmacyOutlet" ADD CONSTRAINT "PharmacyOutlet_pharmacistOwnerId_fkey" FOREIGN KEY ("pharmacistOwnerId") REFERENCES "Pharmacist"("pharmacistId") ON DELETE RESTRICT ON UPDATE CASCADE;
