import { Suspense } from "react";
import RequestBuilderClient from "./RequestBuilderClient";

function BuilderLoading() {
  return (
    <main className="min-h-screen bg-[#f7f7f4] text-[#171717]">
      <header className="border-b border-black/[0.06] bg-[#f7f7f4]">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center px-5 sm:px-7 lg:h-20 lg:px-10">
          <div className="h-9 w-9 animate-pulse rounded-xl bg-black/[0.06]" />

          <div className="ml-4">
            <div className="h-3 w-24 animate-pulse rounded bg-black/[0.07]" />
            <div className="mt-2 h-2 w-16 animate-pulse rounded bg-black/[0.05]" />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1280px] px-5 py-10 sm:px-7 lg:px-10">
        <div className="max-w-[760px]">
          <div className="h-3 w-28 animate-pulse rounded bg-black/[0.06]" />

          <div className="mt-5 h-10 w-3/4 animate-pulse rounded-xl bg-black/[0.07]" />

          <div className="mt-3 h-4 w-full animate-pulse rounded bg-black/[0.05]" />

          <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-black/[0.05]" />

          <div className="mt-10 space-y-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="h-20 animate-pulse rounded-[18px] border border-black/[0.05] bg-white"
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function BuilderPage() {
  return (
    <Suspense fallback={<BuilderLoading />}>
      <RequestBuilderClient />
    </Suspense>
  );
}