-- AlterTable
ALTER TABLE "Works" ADD COLUMN     "createdByUserId" TEXT;

-- AddForeignKey
ALTER TABLE "Works" ADD CONSTRAINT "Works_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Memo" ADD CONSTRAINT "Memo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
