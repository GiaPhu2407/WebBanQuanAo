/*
  Warnings:

  - You are about to drop the column `ResetCode` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `ResetToken` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `ResetTokenExpiry` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `role_permission` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `role_permission` DROP FOREIGN KEY `role_permission_idPermission_fkey`;

-- DropForeignKey
ALTER TABLE `role_permission` DROP FOREIGN KEY `role_permission_idRole_fkey`;

-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_idRole_fkey`;

-- DropIndex
DROP INDEX `users_Sdt_key` ON `users`;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `ResetCode`,
    DROP COLUMN `ResetToken`,
    DROP COLUMN `ResetTokenExpiry`,
    MODIFY `Token` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `role_permission`;

-- CreateTable
CREATE TABLE `RolePermission` (
    `idPermission` INTEGER NOT NULL,
    `IdRole` INTEGER NOT NULL,
    `Id` INTEGER NOT NULL,

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Users` ADD CONSTRAINT `Users_idRole_fkey` FOREIGN KEY (`idRole`) REFERENCES `Role`(`idrole`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RolePermission` ADD CONSTRAINT `RolePermission_IdRole_fkey` FOREIGN KEY (`IdRole`) REFERENCES `Role`(`idrole`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RolePermission` ADD CONSTRAINT `RolePermission_idPermission_fkey` FOREIGN KEY (`idPermission`) REFERENCES `Permission`(`idPermission`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `permission` RENAME INDEX `permission_TenQuyen_key` TO `Permission_TenQuyen_key`;

-- RenameIndex
ALTER TABLE `users` RENAME INDEX `users_Email_key` TO `Users_Email_key`;
