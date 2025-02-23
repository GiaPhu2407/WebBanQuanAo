/*
  Warnings:

  - A unique constraint covering the columns `[tenloai]` on the table `Loaisanpham` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Loaisanpham_tenloai_key` ON `Loaisanpham`(`tenloai`);
