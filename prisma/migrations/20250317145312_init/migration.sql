/*
  Warnings:

  - You are about to alter the column `ngaythanhtoan` on the `thanhtoan` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - A unique constraint covering the columns `[idUsers,ngaytinhluong]` on the table `Luong` will be added. If there are existing duplicate values, this will fail.
  - Made the column `luongcoban` on table `luong` required. This step will fail if there are existing NULL values in that column.
  - Made the column `thuong` on table `luong` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ngaytinhluong` on table `luong` required. This step will fail if there are existing NULL values in that column.
  - Made the column `tongluong` on table `luong` required. This step will fail if there are existing NULL values in that column.
  - Made the column `idUsers` on table `luong` required. This step will fail if there are existing NULL values in that column.
  - Made the column `soca` on table `luong` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `luong` DROP FOREIGN KEY `Luong_idUsers_fkey`;

-- AlterTable
ALTER TABLE `luong` MODIFY `luongcoban` DECIMAL(65, 30) NOT NULL,
    MODIFY `thuong` DECIMAL(65, 30) NOT NULL,
    MODIFY `ngaytinhluong` DATETIME(3) NOT NULL,
    MODIFY `tongluong` DECIMAL(65, 30) NOT NULL,
    MODIFY `idUsers` INTEGER NOT NULL,
    MODIFY `soca` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `thanhtoan` MODIFY `ngaythanhtoan` DATETIME NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Luong_idUsers_ngaytinhluong_key` ON `Luong`(`idUsers`, `ngaytinhluong`);
