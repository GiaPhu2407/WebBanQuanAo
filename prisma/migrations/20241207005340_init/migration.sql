-- CreateTable
CREATE TABLE `LichGiaoHang` (
    `idLichGiaoXe` INTEGER NOT NULL AUTO_INCREMENT,
    `idsanpham` INTEGER NULL,
    `idKhachHang` INTEGER NULL,
    `NgayGiao` DATE NULL,
    `GioGiao` TIME(0) NULL,
    `TrangThai` VARCHAR(225) NULL,
    `idDatCoc` INTEGER NULL,
    `iddonhang` INTEGER NULL,

    PRIMARY KEY (`idLichGiaoXe`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `LichGiaoHang` ADD CONSTRAINT `LichGiaoHang_idsanpham_fkey` FOREIGN KEY (`idsanpham`) REFERENCES `Sanpham`(`idsanpham`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LichGiaoHang` ADD CONSTRAINT `LichGiaoHang_idKhachHang_fkey` FOREIGN KEY (`idKhachHang`) REFERENCES `Users`(`idUsers`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LichGiaoHang` ADD CONSTRAINT `LichGiaoHang_iddonhang_fkey` FOREIGN KEY (`iddonhang`) REFERENCES `Donhang`(`iddonhang`) ON DELETE SET NULL ON UPDATE CASCADE;
