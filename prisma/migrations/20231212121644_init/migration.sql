/*
  Warnings:

  - A unique constraint covering the columns `[id,name]` on the table `Character` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,sourceCharacterId,targetCharacterId]` on the table `CharacterRelation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Character_id_name_key" ON "Character"("id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "CharacterRelation_id_sourceCharacterId_targetCharacterId_key" ON "CharacterRelation"("id", "sourceCharacterId", "targetCharacterId");
