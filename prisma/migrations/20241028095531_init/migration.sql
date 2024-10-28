-- CreateTable
CREATE TABLE `Role` (
    `idrole` INTEGER NOT NULL,
    `Tennguoidung` VARCHAR(255) NULL,

    PRIMARY KEY (`idrole`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Khachhang` (
    `idkhachhang` INTEGER NOT NULL AUTO_INCREMENT,
    `hoten` VARCHAR(255) NULL,
    `sodienthoai` VARCHAR(45) NULL,
    `email` VARCHAR(255) NULL,
    `gioitinh` BOOLEAN NULL,
    `diachi` VARCHAR(45) NULL,
    `ngaysinh` DATETIME(3) NULL,
    `tendangnhap` VARCHAR(45) NULL,
    `matkhau` VARCHAR(45) NULL,
    `idrolekhachhang` INTEGER NULL,

    UNIQUE INDEX `Khachhang_idkhachhang_key`(`idkhachhang`),
    UNIQUE INDEX `Khachhang_email_key`(`email`),
    UNIQUE INDEX `Khachhang_idrolekhachhang_key`(`idrolekhachhang`),
    PRIMARY KEY (`idkhachhang`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Donhang` (
    `iddonhang` INTEGER NOT NULL AUTO_INCREMENT,
    `tongsoluong` INTEGER NULL,
    `trangthai` VARCHAR(45) NULL,
    `tongsotien` INTEGER NULL,
    `ngaydat` VARCHAR(45) NULL,
    `idkhachhang` INTEGER NULL,

    PRIMARY KEY (`iddonhang`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Loaisanpham` (
    `idloaisanpham` INTEGER NOT NULL AUTO_INCREMENT,
    `tenloai` VARCHAR(255) NULL,
    `mota` VARCHAR(255) NULL,

    UNIQUE INDEX `Loaisanpham_tenloai_key`(`tenloai`),
    PRIMARY KEY (`idloaisanpham`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sanpham` (
    `idsanpham` INTEGER NOT NULL AUTO_INCREMENT,
    `tensanpham` VARCHAR(255) NULL,
    `mota` VARCHAR(255) NULL,
    `gia` VARCHAR(255) NULL,
    `hinhanh` VARCHAR(255) NULL,
    `idloaisanpham` INTEGER NULL,
    `giamgia` DECIMAL(5, 2) NULL,
    `gioitinh` BOOLEAN NULL,
    `size` VARCHAR(255) NULL,

    PRIMARY KEY (`idsanpham`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Nhacungcap` (
    `idnhacungcap` INTEGER NOT NULL AUTO_INCREMENT,
    `tennhacungcap` VARCHAR(255) NULL,
    `sodienthoai` VARCHAR(10) NULL,
    `diachi` VARCHAR(45) NULL,
    `email` VARCHAR(45) NULL,
    `trangthai` BOOLEAN NULL,

    UNIQUE INDEX `Nhacungcap_tennhacungcap_key`(`tennhacungcap`),
    UNIQUE INDEX `Nhacungcap_email_key`(`email`),
    PRIMARY KEY (`idnhacungcap`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Nhaphang` (
    `idnhaphang` INTEGER NOT NULL AUTO_INCREMENT,
    `ngaynhap` VARCHAR(45) NULL,
    `tongtien` VARCHAR(255) NULL,
    `tongsoluong` INTEGER NULL,
    `idnhacungcap` INTEGER NULL,

    PRIMARY KEY (`idnhaphang`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Chitietnhap` (
    `idchitietnhap` INTEGER NOT NULL AUTO_INCREMENT,
    `idnhaphang` INTEGER NULL,
    `idsanpham` INTEGER NULL,
    `soluong` VARCHAR(255) NULL,
    `dongia` VARCHAR(255) NULL,

    PRIMARY KEY (`idchitietnhap`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ChitietDonhang` (
    `idchitietdathang` INTEGER NOT NULL AUTO_INCREMENT,
    `iddonhang` INTEGER NULL,
    `soluong` INTEGER NULL,
    `dongia` DECIMAL(5, 2) NULL,
    `idsanpham` INTEGER NULL,

    PRIMARY KEY (`idchitietdathang`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Giohang` (
    `idgiohang` INTEGER NOT NULL AUTO_INCREMENT,
    `soluong` INTEGER NULL,
    `idkhachhang` INTEGER NULL,
    `idsanpham` INTEGER NULL,

    PRIMARY KEY (`idgiohang`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Nhanvien` (
    `idNhanvien` INTEGER NOT NULL AUTO_INCREMENT,
    `tennhanvien` VARCHAR(45) NULL,
    `sodienthoai` VARCHAR(45) NULL,
    `email` VARCHAR(45) NULL,
    `gioitinh` BOOLEAN NULL,
    `ngaysinh` DATETIME(3) NULL,
    `diachi` VARCHAR(45) NULL,
    `ngayvaolam` DATE NULL,
    `idrolenhanvien` INTEGER NULL,

    UNIQUE INDEX `Nhanvien_sodienthoai_key`(`sodienthoai`),
    UNIQUE INDEX `Nhanvien_email_key`(`email`),
    PRIMARY KEY (`idNhanvien`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CaLamViec` (
    `idCaLamViec` INTEGER NOT NULL AUTO_INCREMENT,
    `idnhanvien` INTEGER NULL,
    `ngaylam` DATE NULL,
    `giobatdau` VARCHAR(45) NULL,
    `gioketthuc` VARCHAR(45) NULL,

    PRIMARY KEY (`idCaLamViec`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Luong` (
    `idLuong` INTEGER NOT NULL AUTO_INCREMENT,
    `idnhanvien` INTEGER NULL,
    `luongcoban` DECIMAL(10, 2) NULL,
    `thuong` DECIMAL(6, 2) NULL,
    `ngaytinhluong` DATE NULL,
    `tongluong` DECIMAL(10, 2) NULL,

    PRIMARY KEY (`idLuong`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Thanhtoan` (
    `idthanhtoan` INTEGER NOT NULL AUTO_INCREMENT,
    `iddonhang` INTEGER NULL,
    `phuongthucthanhtoan` VARCHAR(45) NULL,
    `sotien` DECIMAL(10, 2) NULL,
    `trangthai` VARCHAR(255) NULL,
    `ngaythanhtoan` DATE NULL,

    UNIQUE INDEX `Thanhtoan_iddonhang_key`(`iddonhang`),
    PRIMARY KEY (`idthanhtoan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Danhgia` (
    `iddanhgia` INTEGER NOT NULL AUTO_INCREMENT,
    `idsanpham` INTEGER NULL,
    `idkhachang` INTEGER NULL,
    `sao` INTEGER NULL,
    `noidung` VARCHAR(45) NULL,
    `ngaydanhgia` DATE NULL,

    PRIMARY KEY (`iddanhgia`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Kho` (
    `idKho` INTEGER NOT NULL AUTO_INCREMENT,
    `idsanpham` INTEGER NULL,
    `soluong` INTEGER NULL,

    UNIQUE INDEX `Kho_idsanpham_key`(`idsanpham`),
    PRIMARY KEY (`idKho`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Vung` (
    `idVung` INTEGER NOT NULL AUTO_INCREMENT,
    `idkho` INTEGER NULL,
    `tenvung` VARCHAR(45) NULL,

    PRIMARY KEY (`idVung`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ke` (
    `idke` INTEGER NOT NULL AUTO_INCREMENT,
    `idvung` INTEGER NULL,
    `tenke` VARCHAR(45) NULL,

    PRIMARY KEY (`idke`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tang` (
    `idtang` INTEGER NOT NULL,
    `idke` INTEGER NULL,
    `tentang` VARCHAR(255) NULL,

    PRIMARY KEY (`idtang`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tuvanhotro` (
    `idtuvanhotro` INTEGER NOT NULL AUTO_INCREMENT,
    `idkhachang` INTEGER NULL,
    `noidung` VARCHAR(255) NULL,
    `hinhthuc` VARCHAR(45) NULL,
    `trangthai` VARCHAR(45) NULL,
    `idnhanvien` INTEGER NULL,

    PRIMARY KEY (`idtuvanhotro`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Admin` (
    `idadmin` INTEGER NOT NULL AUTO_INCREMENT,
    `idnhanvien` INTEGER NULL,
    `idkhachhang` INTEGER NULL,
    `username` VARCHAR(45) NULL,
    `pasword` VARCHAR(45) NULL,
    `idroleAdmin` INTEGER NULL,

    UNIQUE INDEX `Admin_idnhanvien_key`(`idnhanvien`),
    UNIQUE INDEX `Admin_idkhachhang_key`(`idkhachhang`),
    PRIMARY KEY (`idadmin`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Permission` (
    `idPermission` INTEGER NOT NULL,
    `TenQuyen` VARCHAR(45) NULL,

    UNIQUE INDEX `Permission_TenQuyen_key`(`TenQuyen`),
    PRIMARY KEY (`idPermission`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RolePermission` (
    `idPermission` INTEGER NOT NULL,
    `IdRole` INTEGER NOT NULL,
    `Id` INTEGER NOT NULL,

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Khachhang` ADD CONSTRAINT `Khachhang_idrolekhachhang_fkey` FOREIGN KEY (`idrolekhachhang`) REFERENCES `Role`(`idrole`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Donhang` ADD CONSTRAINT `Donhang_idkhachhang_fkey` FOREIGN KEY (`idkhachhang`) REFERENCES `Khachhang`(`idkhachhang`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sanpham` ADD CONSTRAINT `Sanpham_idloaisanpham_fkey` FOREIGN KEY (`idloaisanpham`) REFERENCES `Loaisanpham`(`idloaisanpham`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Nhaphang` ADD CONSTRAINT `Nhaphang_idnhacungcap_fkey` FOREIGN KEY (`idnhacungcap`) REFERENCES `Nhacungcap`(`idnhacungcap`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Chitietnhap` ADD CONSTRAINT `Chitietnhap_idnhaphang_fkey` FOREIGN KEY (`idnhaphang`) REFERENCES `Nhaphang`(`idnhaphang`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Chitietnhap` ADD CONSTRAINT `Chitietnhap_idsanpham_fkey` FOREIGN KEY (`idsanpham`) REFERENCES `Sanpham`(`idsanpham`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChitietDonhang` ADD CONSTRAINT `ChitietDonhang_iddonhang_fkey` FOREIGN KEY (`iddonhang`) REFERENCES `Donhang`(`iddonhang`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChitietDonhang` ADD CONSTRAINT `ChitietDonhang_idsanpham_fkey` FOREIGN KEY (`idsanpham`) REFERENCES `Sanpham`(`idsanpham`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Giohang` ADD CONSTRAINT `Giohang_idkhachhang_fkey` FOREIGN KEY (`idkhachhang`) REFERENCES `Khachhang`(`idkhachhang`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Giohang` ADD CONSTRAINT `Giohang_idsanpham_fkey` FOREIGN KEY (`idsanpham`) REFERENCES `Sanpham`(`idsanpham`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Nhanvien` ADD CONSTRAINT `Nhanvien_idrolenhanvien_fkey` FOREIGN KEY (`idrolenhanvien`) REFERENCES `Role`(`idrole`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CaLamViec` ADD CONSTRAINT `CaLamViec_idnhanvien_fkey` FOREIGN KEY (`idnhanvien`) REFERENCES `Nhanvien`(`idNhanvien`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Luong` ADD CONSTRAINT `Luong_idnhanvien_fkey` FOREIGN KEY (`idnhanvien`) REFERENCES `Nhanvien`(`idNhanvien`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Thanhtoan` ADD CONSTRAINT `Thanhtoan_iddonhang_fkey` FOREIGN KEY (`iddonhang`) REFERENCES `Donhang`(`iddonhang`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Danhgia` ADD CONSTRAINT `Danhgia_idsanpham_fkey` FOREIGN KEY (`idsanpham`) REFERENCES `Sanpham`(`idsanpham`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Danhgia` ADD CONSTRAINT `Danhgia_idkhachang_fkey` FOREIGN KEY (`idkhachang`) REFERENCES `Khachhang`(`idkhachhang`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Kho` ADD CONSTRAINT `Kho_idsanpham_fkey` FOREIGN KEY (`idsanpham`) REFERENCES `Sanpham`(`idsanpham`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vung` ADD CONSTRAINT `Vung_idkho_fkey` FOREIGN KEY (`idkho`) REFERENCES `Kho`(`idKho`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ke` ADD CONSTRAINT `Ke_idvung_fkey` FOREIGN KEY (`idvung`) REFERENCES `Vung`(`idVung`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tang` ADD CONSTRAINT `Tang_idke_fkey` FOREIGN KEY (`idke`) REFERENCES `Ke`(`idke`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tuvanhotro` ADD CONSTRAINT `Tuvanhotro_idkhachang_fkey` FOREIGN KEY (`idkhachang`) REFERENCES `Khachhang`(`idkhachhang`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tuvanhotro` ADD CONSTRAINT `Tuvanhotro_idnhanvien_fkey` FOREIGN KEY (`idnhanvien`) REFERENCES `Nhanvien`(`idNhanvien`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Admin` ADD CONSTRAINT `Admin_idnhanvien_fkey` FOREIGN KEY (`idnhanvien`) REFERENCES `Nhanvien`(`idNhanvien`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Admin` ADD CONSTRAINT `Admin_idkhachhang_fkey` FOREIGN KEY (`idkhachhang`) REFERENCES `Khachhang`(`idkhachhang`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Admin` ADD CONSTRAINT `Admin_idroleAdmin_fkey` FOREIGN KEY (`idroleAdmin`) REFERENCES `Role`(`idrole`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RolePermission` ADD CONSTRAINT `RolePermission_IdRole_fkey` FOREIGN KEY (`IdRole`) REFERENCES `Role`(`idrole`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RolePermission` ADD CONSTRAINT `RolePermission_idPermission_fkey` FOREIGN KEY (`idPermission`) REFERENCES `Permission`(`idPermission`) ON DELETE RESTRICT ON UPDATE CASCADE;
