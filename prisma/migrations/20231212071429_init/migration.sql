-- CreateEnum
CREATE TYPE "MemoVisibility" AS ENUM ('PRIVATE', 'PUBLIC');

-- AlterTable
ALTER TABLE "Memo" ADD COLUMN     "visibility" "MemoVisibility" DEFAULT 'PUBLIC';
