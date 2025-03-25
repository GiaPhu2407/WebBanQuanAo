/*
  Warnings:

  - You are about to alter the column `ngaythanhtoan` on the `thanhtoan` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `thanhtoan` MODIFY `ngaythanhtoan` DATETIME NULL;

-- CreateTable
CREATE TABLE `UserBehavior` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idUsers` INTEGER NOT NULL,
    `idsanpham` INTEGER NOT NULL,
    `action` ENUM('view', 'add_to_cart', 'purchase') NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
