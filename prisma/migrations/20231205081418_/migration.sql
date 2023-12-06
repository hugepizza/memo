/*
  Warnings:

  - You are about to drop the column `memoId` on the `Works` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Memo" ADD COLUMN     "worksTitle" TEXT;

-- AlterTable
ALTER TABLE "Works" DROP COLUMN "memoId";
