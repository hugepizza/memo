/*
  Warnings:

  - You are about to drop the column `workId` on the `Character` table. All the data in the column will be lost.
  - You are about to drop the column `workId` on the `CharacterRelation` table. All the data in the column will be lost.
  - Added the required column `memoId` to the `Character` table without a default value. This is not possible if the table is not empty.
  - Added the required column `memoId` to the `CharacterRelation` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `sourceCharacterId` on the `CharacterRelation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `targetCharacterId` on the `CharacterRelation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Character" DROP COLUMN "workId",
ADD COLUMN     "memoId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "CharacterRelation" DROP COLUMN "workId",
ADD COLUMN     "memoId" TEXT NOT NULL,
DROP COLUMN "sourceCharacterId",
ADD COLUMN     "sourceCharacterId" INTEGER NOT NULL,
DROP COLUMN "targetCharacterId",
ADD COLUMN     "targetCharacterId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_memoId_fkey" FOREIGN KEY ("memoId") REFERENCES "Reading"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterRelation" ADD CONSTRAINT "CharacterRelation_sourceCharacterId_fkey" FOREIGN KEY ("sourceCharacterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterRelation" ADD CONSTRAINT "CharacterRelation_targetCharacterId_fkey" FOREIGN KEY ("targetCharacterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterRelation" ADD CONSTRAINT "CharacterRelation_memoId_fkey" FOREIGN KEY ("memoId") REFERENCES "Reading"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
