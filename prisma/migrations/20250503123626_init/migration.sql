/*
  Warnings:

  - You are about to alter the column `ngaythanhtoan` on the `thanhtoan` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `thanhtoan` ADD COLUMN `maGiaoDich` VARCHAR(255) NULL,
    ADD COLUMN `vnp_ResponseCode` VARCHAR(10) NULL,
    ADD COLUMN `vnp_TransactionNo` VARCHAR(255) NULL,
    ADD COLUMN `vnp_TxnRef` VARCHAR(255) NULL,
    MODIFY `ngaythanhtoan` DATETIME NULL;

-- CreateIndex
CREATE INDEX `Thanhtoan_vnp_TxnRef_idx` ON `Thanhtoan`(`vnp_TxnRef`);

-- CreateIndex
CREATE INDEX `Thanhtoan_vnp_TransactionNo_idx` ON `Thanhtoan`(`vnp_TransactionNo`);
