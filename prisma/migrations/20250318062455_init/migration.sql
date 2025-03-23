/*
  Warnings:

  - You are about to alter the column `ngaythanhtoan` on the `thanhtoan` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `thanhtoan` MODIFY `ngaythanhtoan` DATETIME NULL;

-- CreateTable
CREATE TABLE `LichLamViec` (
    `idLichLamViec` INTEGER NOT NULL AUTO_INCREMENT,
    `idUsers` INTEGER NOT NULL,
    `NgayLamViec` DATETIME(3) NOT NULL,
    `GioBatDau` DATETIME(3) NOT NULL,
    `GioKetThuc` DATETIME(3) NOT NULL,
    `DiaDiem` VARCHAR(225) NULL,

    PRIMARY KEY (`idLichLamViec`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `LichLamViec` ADD CONSTRAINT `LichLamViec_idUsers_fkey` FOREIGN KEY (`idUsers`) REFERENCES `Users`(`idUsers`) ON DELETE RESTRICT ON UPDATE CASCADE;
