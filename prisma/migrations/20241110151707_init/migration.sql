-- CreateTable
CREATE TABLE `Users` (
    `idUsers` INTEGER NOT NULL AUTO_INCREMENT,
    `Tentaikhoan` VARCHAR(225) NULL,
    `Matkhau` VARCHAR(225) NULL,
    `Hoten` VARCHAR(225) NULL,
    `Sdt` VARCHAR(15) NULL,
    `Diachi` VARCHAR(45) NULL,
    `Email` VARCHAR(45) NULL,
    `idRole` INTEGER NULL,
    `Ngaydangky` DATE NULL,

    UNIQUE INDEX `Users_Email_key`(`Email`),
    PRIMARY KEY (`idUsers`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Users` ADD CONSTRAINT `Users_idRole_fkey` FOREIGN KEY (`idRole`) REFERENCES `Role`(`idrole`) ON DELETE SET NULL ON UPDATE CASCADE;
