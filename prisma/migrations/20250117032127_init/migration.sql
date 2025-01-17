/*
  Warnings:

  - You are about to drop the column `mausac` on the `sanpham` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `sanpham` DROP COLUMN `mausac`;

-- CreateTable
CREATE TABLE `Color` (
    `idmausac` INTEGER NOT NULL AUTO_INCREMENT,
    `tenmau` VARCHAR(255) NOT NULL,
    `mamau` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`idmausac`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductColor` (
    `idsanpham` INTEGER NOT NULL,
    `idmausac` INTEGER NOT NULL,
    `hinhanh` VARCHAR(255) NULL,

    PRIMARY KEY (`idsanpham`, `idmausac`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProductColor` ADD CONSTRAINT `ProductColor_idsanpham_fkey` FOREIGN KEY (`idsanpham`) REFERENCES `Sanpham`(`idsanpham`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductColor` ADD CONSTRAINT `ProductColor_idmausac_fkey` FOREIGN KEY (`idmausac`) REFERENCES `Color`(`idmausac`) ON DELETE RESTRICT ON UPDATE CASCADE;
