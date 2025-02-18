/*
  Warnings:

  - You are about to drop the `rolepermission` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[Sdt]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `rolepermission` DROP FOREIGN KEY `RolePermission_IdRole_fkey`;

-- DropForeignKey
ALTER TABLE `rolepermission` DROP FOREIGN KEY `RolePermission_idPermission_fkey`;

-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `Users_idRole_fkey`;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `ResetCode` VARCHAR(191) NULL,
    ADD COLUMN `ResetToken` VARCHAR(191) NULL,
    ADD COLUMN `ResetTokenExpiry` DATETIME(3) NULL,
    MODIFY `Token` TEXT NULL;

-- DropTable
DROP TABLE `rolepermission`;

-- CreateTable
CREATE TABLE `role_permission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idPermission` INTEGER NOT NULL,
    `idRole` INTEGER NOT NULL,

    UNIQUE INDEX `role_permission_idPermission_idRole_key`(`idPermission`, `idRole`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `users_Sdt_key` ON `users`(`Sdt`);

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_idRole_fkey` FOREIGN KEY (`idRole`) REFERENCES `role`(`idrole`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `role_permission` ADD CONSTRAINT `role_permission_idRole_fkey` FOREIGN KEY (`idRole`) REFERENCES `role`(`idrole`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `role_permission` ADD CONSTRAINT `role_permission_idPermission_fkey` FOREIGN KEY (`idPermission`) REFERENCES `permission`(`idPermission`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `permission` RENAME INDEX `Permission_TenQuyen_key` TO `permission_TenQuyen_key`;

-- RenameIndex
ALTER TABLE `users` RENAME INDEX `Users_Email_key` TO `users_Email_key`;
