"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="flex  max-w-[100vw] flex-col items-center justify-start ">
      <div className="shrink xl:w-1/2">
        <Fitst />
        <Second />
      </div>
      <footer className="footer p-10 bg-neutral text-neutral-content w-screen">
        <aside>
          <svg
            width="50"
            height="50"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            fillRule="evenodd"
            clipRule="evenodd"
            className="fill-current"
          >
            <path d="M22.672 15.226l-2.432.811.841 2.515c.33 1.019-.209 2.127-1.23 2.456-1.15.325-2.148-.321-2.463-1.226l-.84-2.518-5.013 1.677.84 2.517c.391 1.203-.434 2.542-1.831 2.542-.88 0-1.601-.564-1.86-1.314l-.842-2.516-2.431.809c-1.135.328-2.145-.317-2.463-1.229-.329-1.018.211-2.127 1.231-2.456l2.432-.809-1.621-4.823-2.432.808c-1.355.384-2.558-.59-2.558-1.839 0-.817.509-1.582 1.327-1.846l2.433-.809-.842-2.515c-.33-1.02.211-2.129 1.232-2.458 1.02-.329 2.13.209 2.461 1.229l.842 2.515 5.011-1.677-.839-2.517c-.403-1.238.484-2.553 1.843-2.553.819 0 1.585.509 1.85 1.326l.841 2.517 2.431-.81c1.02-.33 2.131.211 2.461 1.229.332 1.018-.21 2.126-1.23 2.456l-2.433.809 1.622 4.823 2.433-.809c1.242-.401 2.557.484 2.557 1.838 0 .819-.51 1.583-1.328 1.847m-8.992-6.428l-5.01 1.675 1.619 4.828 5.011-1.674-1.62-4.829z"></path>
          </svg>
          <p>
            ACME Industries Ltd.
            <br />
            Providing reliable tech since 1992
          </p>
        </aside>
        <nav>
          <header className="footer-title">Social</header>
          <div className="grid grid-flow-col gap-4">
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
              </svg>
            </a>
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
              </svg>
            </a>
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
              </svg>
            </a>
          </div>
        </nav>
      </footer>
    </div>
  );
}

function Fitst() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] items-center justify-center px-2 py-10 text-center ">
      <div className="flex flex-col items-center gap-6 xl:flex-row">
        <div className="flex flex-col gap-2 font-mono text-xs">
          <h1 className="font-title text-center text-[clamp(2rem,6vw,4.2rem)] font-black leading-[1.1] [word-break:auto-phrase] xl:w-[115%] xl:text-start [:root[dir=rtl]_&amp;]:leading-[1.35]">
            <span className="[&amp;::selection]:text-base-content brightness-150 contrast-150 [&amp;::selection]:bg-blue-700/20">
              Bring your novel
            </span>
            <br />
            <span className="inline-grid">
              <span
                className="pointer-events-none col-start-1 row-start-1 bg-[linear-gradient(90deg,theme(colors.error)_0%,theme(colors.secondary)_9%,theme(colors.secondary)_42%,theme(colors.primary)_47%,theme(colors.accent)_100%)] bg-clip-text blur-xl [transform:translate3d(0,0,0)] [-webkit-text-fill-color:transparent] before:content-[attr(data-text)] [@supports(color:oklch(0_0_0))]:bg-[linear-gradient(90deg,oklch(var(--s))_4%,color-mix(in_oklch,oklch(var(--s)),oklch(var(--er)))_22%,oklch(var(--p))_45%,color-mix(in_oklch,oklch(var(--p)),oklch(var(--a)))_67%,oklch(var(--a))_100.2%)]"
                aria-hidden="true"
                data-text="component library"
              ></span>
              <span className="text-center [&amp;::selection]:text-base-content relative col-start-1 row-start-1 bg-[linear-gradient(90deg,theme(colors.error)_0%,theme(colors.secondary)_9%,theme(colors.secondary)_42%,theme(colors.primary)_47%,theme(colors.accent)_100%)] bg-clip-text [-webkit-text-fill-color:transparent] [&amp;::selection]:bg-blue-700/20 [@supports(color:oklch(0_0_0))]:bg-[linear-gradient(90deg,oklch(var(--s))_4%,color-mix(in_oklch,oklch(var(--s)),oklch(var(--er)))_22%,oklch(var(--p))_45%,color-mix(in_oklch,oklch(var(--p)),oklch(var(--a)))_67%,oklch(var(--a))_100.2%)]">
                to life
              </span>
            </span>
            <br />
            <span className="text-center">
              with <span className="text-secondary">Memo</span>
            </span>
          </h1>
          <p className="text-base-content/70 font-title py-4 font-light md:text-lg xl:text-2xl">
            Add characters, establish connections
            <br />
            get hand-drawn network diagrams
            <span className="border-base-content/20 border-b-2">
              <br />
              share your imaginative world
            </span>
          </p>
          <div className="h-10"></div>
          <div>
            <div className="inline-flex w-full flex-col items-stretch justify-center gap-2 px-4 md:flex-row xl:justify-start xl:px-0">
              <Link
                data-sveltekit-preload-data=""
                href="#sample"
                className="btn md:btn-lg md:btn-wide group px-12"
              >
                <span className="hidden sm:inline">See Memo</span>
                <span className="inline sm:hidden">See Memo</span>
              </Link>
              <Link
                data-sveltekit-preload-data=""
                href="/memo"
                className="btn btn-neutral md:btn-lg md:btn-wide group px-12"
              >
                Get started
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="hidden h-6 w-6 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1 md:inline-block"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                  ></path>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Second() {
  return (
    <div className="max-w-[100vw] px-2 py-10 lg:px-10 xl:max-w-[50vw]">
      <div className="font-title text-center xl:text-start">
        <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-none">
          {"don't memorize by "} <br />
          flat note
          <br />
          every time{" "}
          <img
            loading="lazy"
            width="72"
            height="72"
            alt="yawing face emoji"
            src="https://daisyui.com/images/emoji/yawning-face.webp"
            className="pointer-events-none inline-block h-[1em] w-[1em] align-bottom"
          />
        </h2>{" "}
        <p className="text-base-content/70 font-title py-4 font-light md:text-2xl">
          In a memo graph, you need to list characters and relations.
          <br></br>. Memo will generate a network chart by hand-drawn style!
        </p>{" "}
        <div className="h-40"></div>{" "}
        <div className="relative h-[100vh]">
          <div className="sticky top-[16vh] xl:top-[30vh]">
            <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] font-light leading-none">
              instead of flat note
              <br />{" "}
              <span className="text-error">
                and <span className="font-black">boring</span> style
              </span>
            </h2>{" "}
            <div className="h-6"></div>{" "}
            <p className="text-base-content/70 font-title py-4 font-light md:text-2xl">
              For every character, every relations
              <br />
              again and again…
            </p>{" "}
            <div className="h-24"></div>
          </div>
        </div>{" "}
        <div className="relative h-[200vh]">
          <div className="sticky top-[16vh] xl:top-[30vh]">
            <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] font-light leading-none">
              use{" "}
              <span className="text-success">
                <span className="font-black">interactive</span> <br />
                hand-drawn graph
              </span>{" "}
              <img
                loading="lazy"
                width="72"
                height="72"
                alt="sunglasses emoji"
                src="https://daisyui.com/images/emoji/smiling-face-with-sunglasses.webp"
                className="pointer-events-none inline-block h-[1em] w-[1em] align-bottom"
              />
            </h2>{" "}
            <div className="h-6"></div>{" "}
            <p className="text-base-content/70 font-title py-4 font-light md:text-2xl">
              {"It's descriptive, faster, cleaner and easier to maintain."}
            </p>{" "}
            <div className="h-20"></div>
            <div
              id="sample"
              className="mockup-window w-full min-h-[calc(100vh-4rem)] bg-base-200 "
            >
              {/* <img src="https://img.reading-memo.xyz/homepage.svg"></img> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
