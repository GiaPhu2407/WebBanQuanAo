/*
  Warnings:

  - You are about to alter the column `ngaythanhtoan` on the `thanhtoan` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `lichlamviec` ADD COLUMN `idCaLamViec` INTEGER NULL;

-- AlterTable
ALTER TABLE `thanhtoan` MODIFY `ngaythanhtoan` DATETIME NULL;

-- AddForeignKey
ALTER TABLE `LichLamViec` ADD CONSTRAINT `LichLamViec_idCaLamViec_fkey` FOREIGN KEY (`idCaLamViec`) REFERENCES `CaLamViec`(`idCaLamViec`) ON DELETE SET NULL ON UPDATE CASCADE;
