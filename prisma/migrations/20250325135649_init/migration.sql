/*
  Warnings:

  - You are about to alter the column `ngaythanhtoan` on the `thanhtoan` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `sanpham` ADD COLUMN `totalViews` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `thanhtoan` MODIFY `ngaythanhtoan` DATETIME NULL;

-- AddForeignKey
ALTER TABLE `UserBehavior` ADD CONSTRAINT `UserBehavior_idUsers_fkey` FOREIGN KEY (`idUsers`) REFERENCES `Users`(`idUsers`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserBehavior` ADD CONSTRAINT `UserBehavior_idsanpham_fkey` FOREIGN KEY (`idsanpham`) REFERENCES `Sanpham`(`idsanpham`) ON DELETE RESTRICT ON UPDATE CASCADE;
