/*
  Warnings:

  - Added the required column `phoneNumber` to the `VendorOrganization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `website` to the `VendorOrganization` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VendorOrganization" ADD COLUMN     "phoneNumber" TEXT NOT NULL,
ADD COLUMN     "website" TEXT NOT NULL;
