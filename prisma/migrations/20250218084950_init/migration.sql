/*
  Warnings:

  - A unique constraint covering the columns `[Sdt]` on the table `Users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Users_Sdt_key` ON `Users`(`Sdt`);
