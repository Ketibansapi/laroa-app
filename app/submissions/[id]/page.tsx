"use client";

import Link from "next/link";
import { useState } from "react";

type ItemStatus = "pending" | "approved" | "revision";

type ReviewItem = {
  id: string;
  title: string;
  description: string;
  type: "data" | "file" | "agreement";
  value?: string;
  fileName?: string;
  fileSize?: string;
  status: ItemStatus;
  note?: string;
};

const initialItems: ReviewItem[] = [
  {
    id: "company",
    title: "Data perusahaan",
    description: "Informasi dasar perusahaan",
    type: "data",
    value:
      "PT Sinar Digital Indonesia\nSoftware & Technology\nJl. Sudirman No. 88, Jakarta Selatan",
    status: "pending",
  },
  {
    id: "nib",
    title: "NIB",
    description: "Nomor Induk Berusaha",
    type: "file",
    fileName: "NIB-Sinar-Digital.pdf",
    fileSize: "1.2 MB",
    status: "pending",
  },
  {
    id: "npwp",
    title: "NPWP",
    description: "Dokumen NPWP perusahaan",
    type: "file",
    fileName: "NPWP-Sinar-Digital.pdf",
    fileSize: "842 KB",
    status: "pending",
  },
  {
    id: "akta",
    title: "Akta Perusahaan",
    description: "Akta perubahan terakhir",
    type: "file",
    fileName: "Akta-Perubahan-2025.pdf",
    fileSize: "2.4 MB",
    status: "pending",
  },
  {
    id: "agreement",
    title: "Persetujuan",
    description: "Pernyataan kebenaran data",
    type: "agreement",
    value: "Disetujui oleh pengirim",
    status: "pending",
  },
];

export default function SubmissionDetailPage() {
  const [items, setItems] = useState(initialItems);
  const [revisionTarget, setRevisionTarget] = useState<string | null>(
    null,
  );
  const [revisionNote, setRevisionNote] = useState("");
  const [finalStatus, setFinalStatus] = useState<
    "review" | "approved" | "revision"
  >("review");

  const approvedCount = items.filter(
    (item) => item.status === "approved",
  ).length;

  const revisionCount = items.filter(
    (item) => item.status === "revision",
  ).length;

  const allApproved = approvedCount === items.length;

  function approveItem(id: string) {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "approved",
              note: undefined,
            }
          : item,
      ),
    );
  }

  function openRevision(id: string) {
    const item = items.find((current) => current.id === id);

    setRevisionTarget(id);
    setRevisionNote(item?.note ?? "");
  }

  function saveRevision() {
    if (!revisionTarget || !revisionNote.trim()) return;

    setItems((current) =>
      current.map((item) =>
        item.id === revisionTarget
          ? {
              ...item,
              status: "revision",
              note: revisionNote.trim(),
            }
          : item,
      ),
    );

    setRevisionTarget(null);
    setRevisionNote("");
  }

  function approveAll() {
    setItems((current) =>
      current.map((item) => ({
        ...item,
        status: "approved",
        note: undefined,
      })),
    );

    setFinalStatus("approved");
  }

  function sendRevision() {
    if (revisionCount === 0) return;
    setFinalStatus("revision");
  }

  if (finalStatus !== "review") {
    return (
      <ResultScreen
        status={finalStatus}
        revisionCount={revisionCount}
      />
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f7f4] text-[#171717]">
      {/* HEADER */}
      <header className="sticky top-0 z-30 border-b border-black/[0.06] bg-[#f7f7f4]/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1300px] items-center justify-between px-5 sm:px-7 lg:h-20 lg:px-10">
          <div className="flex items-center gap-4">
            <Link
              href="/submissions"
              className="grid h-9 w-9 place-items-center rounded-xl border border-black/[0.08] bg-white text-black/45 transition hover:text-black"
            >
              <BackIcon />
            </Link>

            <div>
              <p className="text-[9px] font-semibold text-black/30">
                SUB-001
              </p>

              <p className="mt-0.5 text-xs font-semibold">
                PT Sinar Digital Indonesia
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <span className="h-2 w-2 rounded-full bg-amber-400" />

            <span className="text-[10px] font-semibold text-black/40">
              Menunggu Review
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1300px] gap-8 px-5 pb-28 pt-8 sm:px-7 lg:grid-cols-[1fr_310px] lg:gap-10 lg:px-10 lg:pt-10">
        {/* MAIN */}
        <div className="min-w-0">
          {/* INTRO */}
          <section>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#171717] px-3 py-1.5 text-[9px] font-semibold text-white">
                Registrasi Vendor
              </span>

              <span className="rounded-full bg-white px-3 py-1.5 text-[9px] font-semibold text-black/35">
                Dikirim hari ini, 14:32
              </span>
            </div>

            <h1 className="mt-6 text-[34px] font-semibold leading-[1.05] tracking-[-0.05em] sm:text-[42px]">
              Review submission
            </h1>

            <p className="mt-3 max-w-[620px] text-sm leading-6 text-black/40">
              Periksa setiap informasi dan dokumen. Setujui jika sudah
              benar, atau minta revisi untuk bagian yang perlu
              diperbaiki.
            </p>
          </section>

          {/* COMPANY SUMMARY */}
          <section className="mt-8 rounded-[22px] border border-black/[0.07] bg-white p-5 sm:p-6">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-[15px] bg-[#f0f0ec] text-xs font-bold text-black/50">
                  SD
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    PT Sinar Digital Indonesia
                  </p>

                  <p className="mt-1 text-[10px] text-black/35">
                    Software & Technology
                  </p>
                </div>
              </div>

              <div className="flex gap-6 border-t border-black/[0.06] pt-4 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
                <MiniStat
                  value={`${approvedCount}/${items.length}`}
                  label="Disetujui"
                />

                <MiniStat
                  value={String(revisionCount)}
                  label="Revisi"
                />
              </div>
            </div>
          </section>

          {/* ITEMS */}
          <section className="mt-5 space-y-3">
            {items.map((item, index) => (
              <ReviewCard
                key={item.id}
                item={item}
                number={String(index + 1).padStart(2, "0")}
                onApprove={() => approveItem(item.id)}
                onRevision={() => openRevision(item.id)}
              />
            ))}
          </section>
        </div>

        {/* SIDE */}
        <aside>
          <div className="space-y-4 lg:sticky lg:top-[110px]">
            {/* REVIEW PROGRESS */}
            <div className="rounded-[22px] border border-black/[0.07] bg-white p-5">
              <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-black/30">
                Review Progress
              </p>

              <div className="mt-4 flex items-end justify-between">
                <div>
                  <p className="text-[28px] font-semibold tracking-[-0.05em]">
                    {approvedCount}/{items.length}
                  </p>

                  <p className="mt-1 text-[9px] text-black/30">
                    bagian disetujui
                  </p>
                </div>

                <span className="text-xs font-semibold text-black/40">
                  {Math.round(
                    (approvedCount / items.length) * 100,
                  )}
                  %
                </span>
              </div>

              <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-black/[0.06]">
                <div
                  className="h-full rounded-full bg-[#171717] transition-all duration-300"
                  style={{
                    width: `${
                      (approvedCount / items.length) * 100
                    }%`,
                  }}
                />
              </div>

              <div className="mt-5 space-y-2.5 border-t border-black/[0.06] pt-4">
                <Legend
                  dot="bg-emerald-500"
                  label="Disetujui"
                  value={approvedCount}
                />

                <Legend
                  dot="bg-red-400"
                  label="Perlu revisi"
                  value={revisionCount}
                />

                <Legend
                  dot="bg-black/15"
                  label="Belum diperiksa"
                  value={
                    items.length -
                    approvedCount -
                    revisionCount
                  }
                />
              </div>
            </div>

            {/* FINAL ACTION */}
            <div className="rounded-[22px] bg-[#171717] p-5 text-white">
              {revisionCount > 0 ? (
                <>
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/10">
                    <RevisionIcon />
                  </div>

                  <h3 className="mt-5 text-sm font-semibold">
                    {revisionCount} bagian perlu diperbaiki
                  </h3>

                  <p className="mt-2 text-[10px] leading-5 text-white/40">
                    Kirim permintaan revisi agar pengirim dapat
                    memperbaiki bagian tersebut.
                  </p>

                  <button
                    type="button"
                    onClick={sendRevision}
                    className="mt-5 flex h-11 w-full items-center justify-between rounded-xl bg-white px-4 text-xs font-semibold text-black transition hover:bg-white/90"
                  >
                    Kirim Permintaan Revisi
                    <ArrowIcon />
                  </button>
                </>
              ) : (
                <>
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/10">
                    <CheckIcon />
                  </div>

                  <h3 className="mt-5 text-sm font-semibold">
                    {allApproved
                      ? "Review selesai"
                      : "Selesaikan review"}
                  </h3>

                  <p className="mt-2 text-[10px] leading-5 text-white/40">
                    {allApproved
                      ? "Semua informasi sudah diperiksa dan siap disetujui."
                      : "Periksa seluruh bagian sebelum menyelesaikan submission."}
                  </p>

                  <button
                    type="button"
                    disabled={!allApproved}
                    onClick={approveAll}
                    className={`mt-5 flex h-11 w-full items-center justify-between rounded-xl px-4 text-xs font-semibold transition ${
                      allApproved
                        ? "bg-white text-black hover:bg-white/90"
                        : "cursor-not-allowed bg-white/10 text-white/25"
                    }`}
                  >
                    Setujui Submission
                    <ArrowIcon />
                  </button>
                </>
              )}
            </div>

            <Link
              href="/submissions"
              className="flex h-11 items-center justify-center rounded-xl border border-black/[0.08] bg-white text-[10px] font-semibold text-black/45 transition hover:text-black"
            >
              Kembali ke Submissions
            </Link>
          </div>
        </aside>
      </div>

      {/* REVISION MODAL */}
      {revisionTarget && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/35 p-0 backdrop-blur-[2px] sm:items-center sm:p-5">
          <div className="w-full max-w-[480px] rounded-t-[26px] bg-white p-6 shadow-2xl sm:rounded-[26px]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-black/30">
                  Minta Revisi
                </p>

                <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em]">
                  Apa yang perlu diperbaiki?
                </h2>
              </div>

              <button
                type="button"
                onClick={() => {
                  setRevisionTarget(null);
                  setRevisionNote("");
                }}
                className="grid h-9 w-9 place-items-center rounded-xl bg-[#f4f4f0] text-black/40"
              >
                <CloseIcon />
              </button>
            </div>

            <p className="mt-3 text-[10px] leading-5 text-black/35">
              Catatan ini nantinya akan dilihat oleh pengirim ketika
              mereka membuka kembali request.
            </p>

            <textarea
              autoFocus
              value={revisionNote}
              onChange={(event) =>
                setRevisionNote(event.target.value)
              }
              placeholder="Contoh: Mohon upload dokumen yang lebih jelas dan masih berlaku."
              rows={5}
              className="mt-5 w-full resize-none rounded-[16px] border border-black/[0.09] bg-[#fafaf8] p-4 text-sm leading-6 outline-none transition placeholder:text-black/20 focus:border-black/25 focus:bg-white"
            />

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setRevisionTarget(null);
                  setRevisionNote("");
                }}
                className="h-11 flex-1 rounded-xl border border-black/[0.08] text-xs font-semibold text-black/45"
              >
                Batal
              </button>

              <button
                type="button"
                disabled={!revisionNote.trim()}
                onClick={saveRevision}
                className={`h-11 flex-[1.5] rounded-xl text-xs font-semibold transition ${
                  revisionNote.trim()
                    ? "bg-[#171717] text-white"
                    : "cursor-not-allowed bg-black/[0.06] text-black/25"
                }`}
              >
                Tandai Perlu Revisi
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

/* COMPONENTS */

function ReviewCard({
  item,
  number,
  onApprove,
  onRevision,
}: {
  item: ReviewItem;
  number: string;
  onApprove: () => void;
  onRevision: () => void;
}) {
  return (
    <article
      className={`overflow-hidden rounded-[20px] border bg-white transition ${
        item.status === "approved"
          ? "border-emerald-500/20"
          : item.status === "revision"
            ? "border-red-400/25"
            : "border-black/[0.07]"
      }`}
    >
      <div className="flex items-start gap-4 p-5 sm:p-6">
        <div
          className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-[9px] font-bold ${
            item.status === "approved"
              ? "bg-emerald-600 text-white"
              : item.status === "revision"
                ? "bg-red-500 text-white"
                : "bg-[#f1f1ed] text-black/35"
          }`}
        >
          {item.status === "approved" ? (
            <SmallCheckIcon />
          ) : item.status === "revision" ? (
            "!"
          ) : (
            number
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
            <div>
              <h3 className="text-sm font-semibold">{item.title}</h3>

              <p className="mt-1 text-[10px] text-black/35">
                {item.description}
              </p>
            </div>

            <ItemStatusBadge status={item.status} />
          </div>

          {/* DATA */}
          {item.type === "data" && (
            <div className="mt-5 whitespace-pre-line rounded-[14px] bg-[#f7f7f4] p-4 text-xs leading-6 text-black/60">
              {item.value}
            </div>
          )}

          {/* FILE */}
          {item.type === "file" && (
            <div className="mt-5 flex items-center gap-3 rounded-[14px] border border-black/[0.06] bg-[#fafaf8] p-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-black/40 shadow-sm">
                <FileIcon />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-semibold">
                  {item.fileName}
                </p>

                <p className="mt-1 text-[9px] text-black/30">
                  PDF · {item.fileSize}
                </p>
              </div>

              <button
                type="button"
                className="flex h-9 items-center gap-2 rounded-xl border border-black/[0.07] bg-white px-3 text-[9px] font-semibold text-black/45 transition hover:text-black"
              >
                <EyeIcon />
                <span className="hidden sm:inline">Lihat</span>
              </button>
            </div>
          )}

          {/* AGREEMENT */}
          {item.type === "agreement" && (
            <div className="mt-5 flex items-center gap-3 rounded-[14px] bg-[#f7f7f4] p-4">
              <div className="grid h-7 w-7 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                <SmallCheckIcon />
              </div>

              <p className="text-[11px] font-semibold text-black/60">
                {item.value}
              </p>
            </div>
          )}

          {item.note && (
            <div className="mt-4 rounded-[14px] bg-red-50 p-4">
              <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-red-400">
                Catatan Revisi
              </p>

              <p className="mt-2 text-[11px] leading-5 text-red-700">
                {item.note}
              </p>
            </div>
          )}

          {/* ACTIONS */}
          <div className="mt-5 flex flex-col gap-2 border-t border-black/[0.06] pt-4 sm:flex-row">
            <button
              type="button"
              onClick={onApprove}
              className={`flex h-10 flex-1 items-center justify-center gap-2 rounded-xl text-[10px] font-semibold transition ${
                item.status === "approved"
                  ? "bg-emerald-50 text-emerald-700"
                  : "border border-black/[0.08] bg-white text-black/50 hover:border-emerald-500/30 hover:text-emerald-700"
              }`}
            >
              <CheckIcon />
              {item.status === "approved"
                ? "Disetujui"
                : "Setujui"}
            </button>

            <button
              type="button"
              onClick={onRevision}
              className={`flex h-10 flex-1 items-center justify-center gap-2 rounded-xl text-[10px] font-semibold transition ${
                item.status === "revision"
                  ? "bg-red-50 text-red-600"
                  : "border border-black/[0.08] bg-white text-black/50 hover:border-red-400/30 hover:text-red-600"
              }`}
            >
              <RevisionIcon />
              {item.status === "revision"
                ? "Edit Catatan Revisi"
                : "Minta Revisi"}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function ItemStatusBadge({ status }: { status: ItemStatus }) {
  if (status === "approved") {
    return (
      <span className="w-fit rounded-full bg-emerald-50 px-2.5 py-1.5 text-[9px] font-semibold text-emerald-700">
        Disetujui
      </span>
    );
  }

  if (status === "revision") {
    return (
      <span className="w-fit rounded-full bg-red-50 px-2.5 py-1.5 text-[9px] font-semibold text-red-600">
        Perlu Revisi
      </span>
    );
  }

  return (
    <span className="w-fit rounded-full bg-[#f3f3ef] px-2.5 py-1.5 text-[9px] font-semibold text-black/35">
      Belum diperiksa
    </span>
  );
}

function MiniStat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div>
      <p className="text-lg font-semibold tracking-[-0.04em]">
        {value}
      </p>
      <p className="mt-1 text-[9px] text-black/30">{label}</p>
    </div>
  );
}

function Legend({
  dot,
  label,
  value,
}: {
  dot: string;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center">
      <span className={`h-2 w-2 rounded-full ${dot}`} />

      <span className="ml-2 flex-1 text-[9px] text-black/35">
        {label}
      </span>

      <span className="text-[9px] font-semibold text-black/50">
        {value}
      </span>
    </div>
  );
}

function ResultScreen({
  status,
  revisionCount,
}: {
  status: "approved" | "revision";
  revisionCount: number;
}) {
  const approved = status === "approved";

  return (
    <main className="grid min-h-screen place-items-center bg-[#f7f7f4] px-5 py-12 text-[#171717]">
      <div className="w-full max-w-[570px] rounded-[28px] border border-black/[0.07] bg-white p-8 text-center shadow-[0_20px_80px_rgba(0,0,0,0.05)] sm:p-12">
        <div
          className={`mx-auto grid h-14 w-14 place-items-center rounded-full text-white ${
            approved ? "bg-[#171717]" : "bg-red-500"
          }`}
        >
          {approved ? <LargeCheckIcon /> : <RevisionIcon />}
        </div>

        <p className="mt-7 text-[9px] font-semibold uppercase tracking-[0.15em] text-black/30">
          {approved ? "Submission selesai" : "Revisi dikirim"}
        </p>

        <h1 className="mt-3 text-[34px] font-semibold tracking-[-0.05em]">
          {approved ? "Submission disetujui." : "Menunggu perbaikan."}
        </h1>

        <p className="mx-auto mt-4 max-w-[400px] text-xs leading-6 text-black/40">
          {approved
            ? "PT Sinar Digital Indonesia telah selesai melalui proses review."
            : `${revisionCount} bagian dikembalikan kepada pengirim untuk diperbaiki.`}
        </p>

        <Link
          href="/submissions"
          className="mt-8 flex h-11 items-center justify-center rounded-xl bg-[#171717] text-xs font-semibold text-white"
        >
          Kembali ke Submissions
        </Link>
      </div>
    </main>
  );
}

/* ICONS */

function BackIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path
        d="M19 12H5M10 7l-5 5 5 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path
        d="m6 12 4 4 8-8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SmallCheckIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
      <path
        d="m6 12 4 4 8-8"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LargeCheckIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="m6 12 4 4 8-8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RevisionIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 8h10a4 4 0 0 1 0 8H8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="m8 5-3 3 3 3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <path
        d="M7 3h7l4 4v14H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M14 3v5h4"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle
        cx="12"
        cy="12"
        r="2.5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12h14M14 7l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path
        d="m7 7 10 10M17 7 7 17"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}