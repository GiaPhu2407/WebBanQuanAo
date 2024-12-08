-- AlterTable
ALTER TABLE `chitietdonhang` ADD COLUMN `idSize` INTEGER NULL;

-- AlterTable
ALTER TABLE `giohang` ADD COLUMN `idSize` INTEGER NULL;

-- CreateTable
CREATE TABLE `Size` (
    `idSize` INTEGER NOT NULL AUTO_INCREMENT,
    `tenSize` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`idSize`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductSize` (
    `idsanpham` INTEGER NOT NULL,
    `idSize` INTEGER NOT NULL,
    `soluong` INTEGER NOT NULL,

    PRIMARY KEY (`idsanpham`, `idSize`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ChitietDonhang` ADD CONSTRAINT `ChitietDonhang_idSize_fkey` FOREIGN KEY (`idSize`) REFERENCES `Size`(`idSize`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Giohang` ADD CONSTRAINT `Giohang_idSize_fkey` FOREIGN KEY (`idSize`) REFERENCES `Size`(`idSize`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductSize` ADD CONSTRAINT `ProductSize_idsanpham_fkey` FOREIGN KEY (`idsanpham`) REFERENCES `Sanpham`(`idsanpham`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductSize` ADD CONSTRAINT `ProductSize_idSize_fkey` FOREIGN KEY (`idSize`) REFERENCES `Size`(`idSize`) ON DELETE RESTRICT ON UPDATE CASCADE;
