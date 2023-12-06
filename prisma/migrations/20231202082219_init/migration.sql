/*
  Warnings:

  - You are about to drop the `Reading` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Character" DROP CONSTRAINT "Character_memoId_fkey";

-- DropForeignKey
ALTER TABLE "CharacterRelation" DROP CONSTRAINT "CharacterRelation_memoId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_memoId_fkey";

-- DropTable
DROP TABLE "Reading";

-- CreateTable
CREATE TABLE "Works" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "googleId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "authors" TEXT[],
    "publisher" TEXT,
    "publishedDate" TEXT,
    "description" TEXT,
    "pageCount" TEXT,
    "smallThumbnail" TEXT,
    "thumbnail" TEXT,
    "memoId" TEXT,

    CONSTRAINT "Works_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Memo" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "worksId" TEXT NOT NULL,

    CONSTRAINT "Memo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Works_googleId_key" ON "Works"("googleId");

-- CreateIndex
CREATE INDEX "Works_googleId_idx" ON "Works"("googleId");

-- CreateIndex
CREATE INDEX "Memo_userId_idx" ON "Memo"("userId");

-- CreateIndex
CREATE INDEX "Character_userId_idx" ON "Character"("userId");

-- CreateIndex
CREATE INDEX "Character_memoId_idx" ON "Character"("memoId");

-- CreateIndex
CREATE INDEX "CharacterRelation_userId_idx" ON "CharacterRelation"("userId");

-- CreateIndex
CREATE INDEX "CharacterRelation_memoId_idx" ON "CharacterRelation"("memoId");

-- CreateIndex
CREATE INDEX "Event_userId_idx" ON "Event"("userId");

-- CreateIndex
CREATE INDEX "Event_memoId_idx" ON "Event"("memoId");

-- AddForeignKey
ALTER TABLE "Memo" ADD CONSTRAINT "Memo_worksId_fkey" FOREIGN KEY ("worksId") REFERENCES "Works"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_memoId_fkey" FOREIGN KEY ("memoId") REFERENCES "Memo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterRelation" ADD CONSTRAINT "CharacterRelation_memoId_fkey" FOREIGN KEY ("memoId") REFERENCES "Memo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_memoId_fkey" FOREIGN KEY ("memoId") REFERENCES "Memo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
