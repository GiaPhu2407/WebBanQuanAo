/*
  Warnings:

  - You are about to alter the column `dongia` on the `chitietdonhang` table. The data in that column could be lost. The data in that column will be cast from `Decimal(5,2)` to `Decimal(15,2)`.

*/
-- AlterTable
ALTER TABLE `chitietdonhang` MODIFY `dongia` DECIMAL(15, 2) NULL;
