/*
  Warnings:

  - You are about to alter the column `trangthai` on the `sanpham` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `ngaythanhtoan` on the `thanhtoan` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `sanpham` ADD COLUMN `releaseDate` DATETIME(3) NULL,
    MODIFY `trangthai` VARCHAR(191) NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE `thanhtoan` MODIFY `ngaythanhtoan` DATETIME NULL;
