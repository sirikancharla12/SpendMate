/*
  Warnings:

  - Added the required column `recurringStartDate` to the `Expense` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
-- AlterTable
ALTER TABLE "Expense"
ADD COLUMN "recurring" BOOLEAN NOT NULL DEFAULT TRUE,
ADD COLUMN "recurringFrequency" TEXT,
ADD COLUMN "recurringStartDate" TIMESTAMP(3) NOT NULL;

