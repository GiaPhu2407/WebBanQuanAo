/*
  Warnings:

  - You are about to alter the column `ngaydat` on the `donhang` table. The data in that column could be lost. The data in that column will be cast from `VarChar(45)` to `Date`.

*/
-- AlterTable
ALTER TABLE `donhang` MODIFY `ngaydat` DATE NULL;
