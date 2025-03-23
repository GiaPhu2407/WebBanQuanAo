/*
  Warnings:

  - You are about to alter the column `luongcoban` on the `luong` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `thuong` on the `luong` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `ngaythanhtoan` on the `thanhtoan` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `luong` MODIFY `luongcoban` DECIMAL(10, 2) NOT NULL,
    MODIFY `thuong` DECIMAL(10, 2) NOT NULL;

-- AlterTable
ALTER TABLE `thanhtoan` MODIFY `ngaythanhtoan` DATETIME NULL;
