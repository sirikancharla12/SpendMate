/*
  Warnings:

  - Added the required column `category` to the `Savings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Savings" ADD COLUMN     "category" TEXT NOT NULL;
