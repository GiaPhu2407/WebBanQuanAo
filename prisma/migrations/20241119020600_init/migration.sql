/*
  Warnings:

  - You are about to drop the column `idkhachang` on the `danhgia` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `danhgia` DROP FOREIGN KEY `Danhgia_idkhachang_fkey`;

-- AlterTable
ALTER TABLE `danhgia` DROP COLUMN `idkhachang`,
    ADD COLUMN `idUsers` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Danhgia` ADD CONSTRAINT `Danhgia_idUsers_fkey` FOREIGN KEY (`idUsers`) REFERENCES `Users`(`idUsers`) ON DELETE SET NULL ON UPDATE CASCADE;
