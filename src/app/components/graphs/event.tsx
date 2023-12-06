import { Event } from "@/app/tpyes/model";
import { Prisma } from "@prisma/client";
import { cloneDeep } from "lodash";

export default function Events({ events }: { events: Event[] }) {
  if (!events || events.length === 0) {
    return <>No events yet</>;
  }

  const first = cloneDeep(events[0]);
  first.progressPercentage = 0;
  first.name = "开始";
  const end = cloneDeep(events[0]);
  end.progressPercentage = 100;
  end.name = "结束";
  const evs = events
    .concat(first, end)
    .sort((a, b) => (a.progressPercentage ?? 0) - (b.progressPercentage ?? 0));
  console.log("evs", evs);

  return (
    <div className="flex w-full justify-center items-center ">
      <ul className="timeline">
        {evs.map((e, index) => (
          <li key={e.progressPercentage}>
            {index != 0 && <hr />}
            <div className="timeline-start">{`${e.progressPercentage!}%`}</div>
            <div className="timeline-middle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="timeline-end timeline-box">{e.name}</div>
            {index != evs.length - 1 && <hr />}
          </li>
        ))}
      </ul>
    </div>
  );
}
