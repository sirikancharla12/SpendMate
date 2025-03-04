/*
  Warnings:

  - Added the required column `amountSaved` to the `Savings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `targetDate` to the `Savings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Expense" ALTER COLUMN "recurring" SET DEFAULT false;

-- AlterTable
ALTER TABLE "Savings" ADD COLUMN     "amountSaved" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "targetDate" TIMESTAMP(3) NOT NULL;
