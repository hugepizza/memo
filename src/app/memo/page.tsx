"use client";
import useSWR from "swr";
import Image from "next/image";
import Link from "next/link";
import { Memo } from "../tpyes/model";

const elementWidth = 240;
export default function Page() {
  const { data, isLoading } = useSWR("/api/memo", (url: string) =>
    fetch(url, { method: "GET" })
      .then((resp) => resp.json())
      .then((resp) => resp.data.memo as Memo[])
  );

  return (
    <div className="flex flex-col justify-center w-full space-y-2">
      <AddButton />
      <div className="flex justify-center w-full">
        <div className="grid gap-4 grid-cols-4 w-full">
          {isLoading ? <SkeletonGroup /> : <CardGroup memo={data}></CardGroup>}
        </div>
      </div>
    </div>
  );
}

function CardGroup({ memo }: { memo?: Memo[] }) {
  const g = memo?.map((ele) => <MemoCard key={ele.id} memo={ele} />);
  return g;
}

function MemoCard({ memo }: { memo: Memo }) {
  return (
    <Link
      className="col-span-1 min-w-0 flex-grow"
      style={{ width: elementWidth, height: elementWidth * 1.5 }}
      href={"/memo/" + memo.id}
    >
      <figure className="w-full h-4/5 relative">
        <Image
          className="rounded-2xl"
          src={memo.works.smallThumbnail || memo.works.thumbnail || ""}
          alt={memo.works.title}
          layout="fill"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </figure>
      <p className="truncate">{memo.works.title}</p>
      <div className="flex flex-row justify-end space-x-2">
        <CharacterIcon count={memo.characters.length} />
        <RelationIcon count={memo.characterRelations.length} />
        <EventIcon count={memo.events.length} />
      </div>
    </Link>
  );
}

function SkeletonGroup() {
  const skeleton = (
    <div
      className="skeleton col-span-1 flex-grow"
      style={{ width: elementWidth, height: elementWidth * 1.5 * 0.8 }}
    />
  );
  return (
    <>
      {skeleton}
      {skeleton}
      {skeleton}
      {skeleton}
    </>
  );
}

function AddButton() {
  return (
    <Link href={"/works"} className="btn">
      Add New MEMO
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </Link>
  );
}

function CharacterIcon({ count }: { count: number }) {
  if (count === 0) {
    return <></>;
  }
  return (
    <div className="lg:tooltip" data-tip={`${count} characters`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2.5}
        stroke="currentColor"
        className="w-4 h-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
        />
      </svg>
    </div>
  );
}

function RelationIcon({ count }: { count: number }) {
  if (count === 0) {
    return <></>;
  }
  return (
    <div className="lg:tooltip" data-tip={`${count} relations`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2.5}
        stroke="currentColor"
        className="w-4 h-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
        />
      </svg>
    </div>
  );
}

function EventIcon({ count }: { count: number }) {
  if (count === 0) {
    return <></>;
  }
  return (
    <div className="lg:tooltip" data-tip={`${count} events`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2.5}
        stroke="currentColor"
        className="w-4 h-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
        />
      </svg>
    </div>
  );
}
