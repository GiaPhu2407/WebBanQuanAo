-- AlterTable
ALTER TABLE `thanhtoan` ADD COLUMN `stripe_payment_intent_id` VARCHAR(255) NULL,
    ADD COLUMN `stripe_payment_status` VARCHAR(50) NULL,
    ADD COLUMN `stripe_session_id` VARCHAR(255) NULL;

-- CreateIndex
CREATE INDEX `Thanhtoan_stripe_session_id_idx` ON `Thanhtoan`(`stripe_session_id`);

-- CreateIndex
CREATE INDEX `Thanhtoan_stripe_payment_intent_id_idx` ON `Thanhtoan`(`stripe_payment_intent_id`);
