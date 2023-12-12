import { Prisma } from "@prisma/client";

export type SearchMode = "books" | "character";

export type GoogleBook = {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    publisher?: string;
    publishedDate?: string;
    description?: string;
    pageCount?: number;
    imageLinks?: {
      smallThumbnail?: string;
      thumbnail?: string;
    };
  };
};
export type Memo = Prisma.MemoGetPayload<{
  include: {
    characterRelations: {
      include: { sourceCharacter: true; targetCharacter: true };
    };
    characters: true;
    events: true;
    works: true;
  };
}>;
export type Character = Prisma.CharacterGetPayload<{}>;
export type Relation = Prisma.CharacterRelationGetPayload<{
  include: { sourceCharacter: true; targetCharacter: true };
}>;

export type Event = Prisma.EventGetPayload<{}>;
