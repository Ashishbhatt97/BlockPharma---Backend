/*
  Warnings:

  - You are about to drop the column `oAuthId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `provider` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "oAuthId",
DROP COLUMN "provider",
ALTER COLUMN "phoneNumber" DROP NOT NULL;
