/*
  Warnings:

  - The primary key for the `Orders` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `orderid` on the `Orders` table. All the data in the column will be lost.
  - Added the required column `amount` to the `Orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currency` to the `Orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderId` to the `Orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentMethod` to the `Orders` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "paymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "paymentMethod" AS ENUM ('CASH_ON_DELIVERY', 'UPI', 'CARD', 'NET_BANKING', 'CRYPTO');

-- AlterTable
ALTER TABLE "Orders" DROP CONSTRAINT "Orders_pkey",
DROP COLUMN "orderid",
ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "currency" TEXT NOT NULL,
ADD COLUMN     "orderId" TEXT NOT NULL,
ADD COLUMN     "paymentMethod" "paymentMethod" NOT NULL,
ADD COLUMN     "paymentStatus" "paymentStatus" NOT NULL DEFAULT 'PENDING',
ADD CONSTRAINT "Orders_pkey" PRIMARY KEY ("orderId");
