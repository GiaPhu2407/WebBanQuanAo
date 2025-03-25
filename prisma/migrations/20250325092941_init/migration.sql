/*
  Warnings:

  - You are about to alter the column `ngaythanhtoan` on the `thanhtoan` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `thanhtoan` MODIFY `ngaythanhtoan` DATETIME NULL;

-- AlterTable
ALTER TABLE `userbehavior` ADD COLUMN `score` INTEGER NOT NULL DEFAULT 0;
