/*
  Warnings:

  - You are about to alter the column `ngaythanhtoan` on the `thanhtoan` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `sanpham` ADD COLUMN `popularity` DOUBLE NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `thanhtoan` MODIFY `ngaythanhtoan` DATETIME NULL;
