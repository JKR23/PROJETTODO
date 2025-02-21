/*
  Warnings:

  - Added the required column `reservedUntil` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `reservation` ADD COLUMN `reservedUntil` DATETIME(3) NOT NULL;
