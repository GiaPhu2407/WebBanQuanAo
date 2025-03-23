/*
  Warnings:

  - You are about to alter the column `ngaythanhtoan` on the `thanhtoan` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- DropIndex
DROP INDEX `Tuvanhotro_idkhachang_fkey` ON `tuvanhotro`;

-- AlterTable
ALTER TABLE `luong` MODIFY `ngaytinhluong` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `thanhtoan` MODIFY `ngaythanhtoan` DATETIME NULL;
