/*
  Warnings:

  - Made the column `visibility` on table `Memo` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Memo" ALTER COLUMN "visibility" SET NOT NULL;
