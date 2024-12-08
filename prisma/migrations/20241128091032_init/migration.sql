-- CreateTable
CREATE TABLE `Yeuthich` (
    `idYeuthich` INTEGER NOT NULL AUTO_INCREMENT,
    `idUsers` INTEGER NOT NULL,
    `idSanpham` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`idYeuthich`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Yeuthich` ADD CONSTRAINT `Yeuthich_idUsers_fkey` FOREIGN KEY (`idUsers`) REFERENCES `Users`(`idUsers`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Yeuthich` ADD CONSTRAINT `Yeuthich_idSanpham_fkey` FOREIGN KEY (`idSanpham`) REFERENCES `Sanpham`(`idsanpham`) ON DELETE RESTRICT ON UPDATE CASCADE;
