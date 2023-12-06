/*
  Warnings:

  - Added the required column `name` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `memoId` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `remark` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "date" TIMESTAMP(3),
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "page" INTEGER,
ADD COLUMN     "progressPercentage" INTEGER,
ADD COLUMN     "memoId" TEXT NOT NULL,
ADD COLUMN     "remark" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_memoId_fkey" FOREIGN KEY ("memoId") REFERENCES "Reading"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
