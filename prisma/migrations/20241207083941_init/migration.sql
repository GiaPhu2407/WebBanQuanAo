/*
  Warnings:

  - You are about to drop the column `idUsers` on the `giohang` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `giohang` DROP FOREIGN KEY `Giohang_idUsers_fkey`;

-- AlterTable
ALTER TABLE `giohang` DROP COLUMN `idUsers`,
    ADD COLUMN `idKhachHang` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Giohang` ADD CONSTRAINT `Giohang_idKhachHang_fkey` FOREIGN KEY (`idKhachHang`) REFERENCES `Users`(`idUsers`) ON DELETE SET NULL ON UPDATE CASCADE;
