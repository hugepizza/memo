/*
  Warnings:

  - You are about to drop the column `thumbnail` on the `Memo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Memo" DROP COLUMN "thumbnail",
ADD COLUMN     "cover" TEXT;
