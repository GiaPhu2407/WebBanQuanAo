/*
  Warnings:

  - You are about to drop the column `idnhanvien` on the `calamviec` table. All the data in the column will be lost.
  - You are about to drop the column `idnhanvien` on the `luong` table. All the data in the column will be lost.
  - You are about to alter the column `ngaythanhtoan` on the `thanhtoan` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to drop the column `idnhanvien` on the `tuvanhotro` table. All the data in the column will be lost.
  - You are about to drop the `admin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `khachhang` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `nhanvien` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `admin` DROP FOREIGN KEY `Admin_idkhachhang_fkey`;

-- DropForeignKey
ALTER TABLE `admin` DROP FOREIGN KEY `Admin_idnhanvien_fkey`;

-- DropForeignKey
ALTER TABLE `admin` DROP FOREIGN KEY `Admin_idroleAdmin_fkey`;

-- DropForeignKey
ALTER TABLE `calamviec` DROP FOREIGN KEY `CaLamViec_idnhanvien_fkey`;

-- DropForeignKey
ALTER TABLE `khachhang` DROP FOREIGN KEY `Khachhang_idrolekhachhang_fkey`;

-- DropForeignKey
ALTER TABLE `luong` DROP FOREIGN KEY `Luong_idnhanvien_fkey`;

-- DropForeignKey
ALTER TABLE `nhanvien` DROP FOREIGN KEY `Nhanvien_idrolenhanvien_fkey`;

-- DropForeignKey
ALTER TABLE `tuvanhotro` DROP FOREIGN KEY `Tuvanhotro_idkhachang_fkey`;

-- DropForeignKey
ALTER TABLE `tuvanhotro` DROP FOREIGN KEY `Tuvanhotro_idnhanvien_fkey`;

-- AlterTable
ALTER TABLE `calamviec` DROP COLUMN `idnhanvien`,
    ADD COLUMN `idUsers` INTEGER NULL;

-- AlterTable
ALTER TABLE `luong` DROP COLUMN `idnhanvien`,
    ADD COLUMN `idUsers` INTEGER NULL,
    ADD COLUMN `soca` INTEGER NULL;

-- AlterTable
ALTER TABLE `thanhtoan` MODIFY `ngaythanhtoan` DATETIME NULL;

-- AlterTable
ALTER TABLE `tuvanhotro` DROP COLUMN `idnhanvien`,
    ADD COLUMN `idUsers` INTEGER NULL;

-- DropTable
DROP TABLE `admin`;

-- DropTable
DROP TABLE `khachhang`;

-- DropTable
DROP TABLE `nhanvien`;

-- AddForeignKey
ALTER TABLE `CaLamViec` ADD CONSTRAINT `CaLamViec_idUsers_fkey` FOREIGN KEY (`idUsers`) REFERENCES `Users`(`idUsers`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Luong` ADD CONSTRAINT `Luong_idUsers_fkey` FOREIGN KEY (`idUsers`) REFERENCES `Users`(`idUsers`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tuvanhotro` ADD CONSTRAINT `Tuvanhotro_idUsers_fkey` FOREIGN KEY (`idUsers`) REFERENCES `Users`(`idUsers`) ON DELETE SET NULL ON UPDATE CASCADE;
