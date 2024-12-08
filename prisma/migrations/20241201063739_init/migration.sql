/*
  Warnings:

  - You are about to drop the column `idkhachhang` on the `donhang` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `donhang` DROP FOREIGN KEY `Donhang_idkhachhang_fkey`;

-- AlterTable
ALTER TABLE `donhang` DROP COLUMN `idkhachhang`,
    ADD COLUMN `idUsers` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Donhang` ADD CONSTRAINT `Donhang_idUsers_fkey` FOREIGN KEY (`idUsers`) REFERENCES `Users`(`idUsers`) ON DELETE SET NULL ON UPDATE CASCADE;
