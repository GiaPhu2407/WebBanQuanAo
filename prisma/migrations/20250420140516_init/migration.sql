/*
  Warnings:

  - You are about to alter the column `ngaythanhtoan` on the `thanhtoan` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `donhang` ADD COLUMN `idDiaChi` INTEGER NULL;

-- AlterTable
ALTER TABLE `thanhtoan` MODIFY `ngaythanhtoan` DATETIME NULL;

-- CreateTable
CREATE TABLE `DiaChi` (
    `idDiaChi` INTEGER NOT NULL AUTO_INCREMENT,
    `idUsers` INTEGER NOT NULL,
    `diaChiChiTiet` VARCHAR(255) NOT NULL,
    `thanhPho` VARCHAR(100) NOT NULL,
    `quanHuyen` VARCHAR(100) NOT NULL,
    `phuongXa` VARCHAR(100) NOT NULL,
    `soDienThoai` VARCHAR(20) NOT NULL,
    `tenNguoiNhan` VARCHAR(100) NOT NULL,
    `macDinh` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`idDiaChi`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Donhang` ADD CONSTRAINT `Donhang_idDiaChi_fkey` FOREIGN KEY (`idDiaChi`) REFERENCES `DiaChi`(`idDiaChi`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DiaChi` ADD CONSTRAINT `DiaChi_idUsers_fkey` FOREIGN KEY (`idUsers`) REFERENCES `Users`(`idUsers`) ON DELETE RESTRICT ON UPDATE CASCADE;
