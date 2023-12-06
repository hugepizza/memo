/*
  Warnings:

  - The `pageCount` column on the `Works` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `worksTitle` on table `Memo` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Memo" ALTER COLUMN "worksTitle" SET NOT NULL;

-- AlterTable
ALTER TABLE "Works" DROP COLUMN "pageCount",
ADD COLUMN     "pageCount" INTEGER;
