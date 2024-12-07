/*
  Warnings:

  - You are about to drop the column `idkhachhang` on the `giohang` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `giohang` DROP FOREIGN KEY `Giohang_idkhachhang_fkey`;

-- AlterTable
ALTER TABLE `giohang` DROP COLUMN `idkhachhang`,
    ADD COLUMN `idUsers` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Giohang` ADD CONSTRAINT `Giohang_idUsers_fkey` FOREIGN KEY (`idUsers`) REFERENCES `Users`(`idUsers`) ON DELETE SET NULL ON UPDATE CASCADE;
