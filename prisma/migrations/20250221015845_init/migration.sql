-- CreateTable
CREATE TABLE `Notification` (
    `idNotification` INTEGER NOT NULL AUTO_INCREMENT,
    `idUsers` INTEGER NULL,
    `title` VARCHAR(255) NOT NULL,
    `message` TEXT NOT NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `type` VARCHAR(50) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `idDonhang` INTEGER NULL,
    `idThanhtoan` INTEGER NULL,

    INDEX `Notification_idUsers_idx`(`idUsers`),
    INDEX `Notification_createdAt_idx`(`createdAt`),
    INDEX `Notification_isRead_idx`(`isRead`),
    PRIMARY KEY (`idNotification`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_idUsers_fkey` FOREIGN KEY (`idUsers`) REFERENCES `Users`(`idUsers`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_idDonhang_fkey` FOREIGN KEY (`idDonhang`) REFERENCES `Donhang`(`iddonhang`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_idThanhtoan_fkey` FOREIGN KEY (`idThanhtoan`) REFERENCES `Thanhtoan`(`idthanhtoan`) ON DELETE SET NULL ON UPDATE CASCADE;
