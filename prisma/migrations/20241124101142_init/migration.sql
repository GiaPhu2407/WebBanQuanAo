-- CreateTable
CREATE TABLE `Image` (
    `idImage` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(255) NOT NULL,
    `altText` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `idSanpham` INTEGER NULL,

    PRIMARY KEY (`idImage`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_idSanpham_fkey` FOREIGN KEY (`idSanpham`) REFERENCES `Sanpham`(`idsanpham`) ON DELETE SET NULL ON UPDATE CASCADE;
