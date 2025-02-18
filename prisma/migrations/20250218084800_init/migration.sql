-- AlterTable
ALTER TABLE `users` ADD COLUMN `ResetCode` VARCHAR(191) NULL,
    ADD COLUMN `ResetToken` VARCHAR(191) NULL,
    ADD COLUMN `ResetTokenExpiry` DATETIME(3) NULL;
