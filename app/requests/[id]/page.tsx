"use client";

import Link from "next/link";
import { useState } from "react";

type Tab = "overview" | "submissions" | "settings";
type RequestStatus = "active" | "paused" | "closed";

const submissions = [
  {
    id: "SUB-001",
    company: "PT Sinar Digital Indonesia",
    initials: "SD",
    submittedAt: "Hari ini, 14:32",
    status: "Menunggu Review",
  },
  {
    id: "SUB-002",
    company: "PT Nusantara Kreatif",
    initials: "NK",
    submittedAt: "Hari ini, 11:08",
    status: "Menunggu Review",
  },
  {
    id: "SUB-006",
    company: "PT Arunika Teknologi",
    initials: "AT",
    submittedAt: "Kemarin, 16:20",
    status: "Selesai",
  },
  {
    id: "SUB-007",
    company: "PT Karya Digital Bersama",
    initials: "KD",
    submittedAt: "Kemarin, 13:05",
    status: "Selesai",
  },
];

const requirements = [
  {
    title: "Data perusahaan",
    description: "Nama perusahaan, jenis usaha, dan alamat",
    type: "Data / Teks",
    required: true,
  },
  {
    title: "NIB",
    description: "Nomor Induk Berusaha",
    type: "Upload Dokumen",
    required: true,
  },
  {
    title: "NPWP",
    description: "Dokumen NPWP perusahaan",
    type: "Upload Dokumen",
    required: true,
  },
  {
    title: "Akta Perusahaan",
    description: "Akta perusahaan atau perubahan terakhir",
    type: "Upload Dokumen",
    required: true,
  },
  {
    title: "Persetujuan",
    description: "Pernyataan kebenaran informasi",
    type: "Persetujuan",
    required: true,
  },
];

export default function RequestDetailPage() {
  const [tab, setTab] = useState<Tab>("overview");
  const [requestStatus, setRequestStatus] =
    useState<RequestStatus>("active");
  const [copied, setCopied] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const token = "a8F2kP";

  async function copyLink() {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/r/${token}`
        : `laroa.app/r/${token}`;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1600);
    } catch {
      setCopied(false);
    }
  }

  function shareWhatsApp() {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/r/${token}`
        : `https://laroa.app/r/${token}`;

    const message = `Halo, silakan lengkapi Registrasi Vendor melalui link berikut:\n\n${url}`;

    window.open(
      `https://wa.me/?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f7f4] text-[#171717]">
      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-black/[0.06] bg-[#f7f7f4]/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 sm:px-7 lg:h-20 lg:px-10">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <Link
              href="/requests"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-black/[0.08] bg-white text-black/45 transition hover:text-black"
              aria-label="Kembali"
            >
              <BackIcon />
            </Link>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate text-xs font-semibold sm:text-sm">
                  Registrasi Vendor
                </p>

                <StatusBadge status={requestStatus} />
              </div>

              <p className="mt-1 text-[9px] font-medium text-black/30">
                LR-001 · Vendor
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/requests/new/builder?template=vendor"
              className="hidden h-10 items-center gap-2 rounded-xl border border-black/[0.08] bg-white px-4 text-[10px] font-semibold text-black/50 transition hover:text-black sm:flex"
            >
              <EditIcon />
              Edit Request
            </Link>

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowMore((value) => !value)}
                className="grid h-10 w-10 place-items-center rounded-xl border border-black/[0.08] bg-white text-black/45 transition hover:text-black"
                aria-label="Menu lainnya"
              >
                <MoreIcon />
              </button>

              {showMore && (
                <div className="absolute right-0 top-12 z-50 w-[210px] rounded-[16px] border border-black/[0.08] bg-white p-2 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
                  {requestStatus !== "paused" && (
                    <button
                      type="button"
                      onClick={() => {
                        setRequestStatus("paused");
                        setShowMore(false);
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[10px] font-semibold text-black/55 hover:bg-[#f5f5f1]"
                    >
                      <PauseIcon />
                      Pause Request
                    </button>
                  )}

                  {requestStatus === "paused" && (
                    <button
                      type="button"
                      onClick={() => {
                        setRequestStatus("active");
                        setShowMore(false);
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[10px] font-semibold text-black/55 hover:bg-[#f5f5f1]"
                    >
                      <PlayIcon />
                      Aktifkan Kembali
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setRequestStatus("closed");
                      setShowMore(false);
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[10px] font-semibold text-red-600 hover:bg-red-50"
                  >
                    <CloseRequestIcon />
                    Tutup Request
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1280px] px-5 pb-24 pt-8 sm:px-7 lg:px-10 lg:pt-10">
        {/* HERO */}
        <section className="grid gap-6 lg:grid-cols-[1fr_370px]">
          <div className="rounded-[24px] bg-[#171717] p-6 text-white sm:p-8 lg:p-9">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white/10 px-3 py-1.5 text-[9px] font-semibold text-white/70">
                Vendor
              </span>

              <span className="rounded-full bg-white/10 px-3 py-1.5 text-[9px] font-semibold text-white/70">
                5 kebutuhan
              </span>
            </div>

            <h1 className="mt-7 max-w-[600px] text-[36px] font-semibold leading-[1.03] tracking-[-0.055em] sm:text-[46px]">
              Registrasi Vendor
            </h1>

            <p className="mt-4 max-w-[580px] text-xs leading-6 text-white/45 sm:text-sm">
              Lengkapi data dan dokumen perusahaan berikut untuk proses
              registrasi vendor.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-3 border-t border-white/10 pt-6">
              <HeroStat value="12" label="Submission" />
              <HeroStat value="8" label="Selesai" />
              <HeroStat value="2" label="Menunggu Review" />
            </div>
          </div>

          {/* PUBLIC LINK */}
          <div className="rounded-[24px] border border-black/[0.07] bg-white p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-black/30">
                  Public Link
                </p>

                <h2 className="mt-2 text-sm font-semibold">
                  Bagikan request
                </h2>
              </div>

              <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#f3f3ef] text-black/40">
                <LinkIcon />
              </div>
            </div>

            <div className="mt-6 rounded-[15px] bg-[#f7f7f4] p-4">
              <p className="break-all text-[11px] font-semibold">
                laroa.app/r/{token}
              </p>

              <p className="mt-1.5 text-[9px] text-black/30">
                Penerima tidak perlu membuat akun.
              </p>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={copyLink}
                className={`flex h-10 items-center justify-center gap-2 rounded-xl border text-[10px] font-semibold transition ${
                  copied
                    ? "border-emerald-500/20 bg-emerald-50 text-emerald-700"
                    : "border-black/[0.08] text-black/50 hover:text-black"
                }`}
              >
                {copied ? <CheckIcon /> : <CopyIcon />}
                {copied ? "Tersalin" : "Salin Link"}
              </button>

              <button
                type="button"
                onClick={shareWhatsApp}
                className="flex h-10 items-center justify-center gap-2 rounded-xl bg-[#171717] text-[10px] font-semibold text-white transition hover:bg-black/80"
              >
                <ShareIcon />
                WhatsApp
              </button>
            </div>

            <Link
              href={`/r/${token}`}
              className="mt-3 flex h-10 items-center justify-center gap-2 rounded-xl bg-[#f5f5f1] text-[10px] font-semibold text-black/45 transition hover:text-black"
            >
              <EyeIcon />
              Lihat sebagai penerima
            </Link>

            {requestStatus !== "active" && (
              <div
                className={`mt-4 rounded-[14px] p-3 text-[9px] font-medium leading-5 ${
                  requestStatus === "paused"
                    ? "bg-amber-50 text-amber-700"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {requestStatus === "paused"
                  ? "Request sedang dijeda. Link publik tidak menerima submission baru."
                  : "Request telah ditutup dan tidak menerima submission baru."}
              </div>
            )}
          </div>
        </section>

        {/* TABS */}
        <section className="mt-8">
          <div className="flex gap-1 overflow-x-auto border-b border-black/[0.07]">
            <TabButton
              active={tab === "overview"}
              onClick={() => setTab("overview")}
            >
              Overview
            </TabButton>

            <TabButton
              active={tab === "submissions"}
              onClick={() => setTab("submissions")}
            >
              Submissions
              <span
                className={`ml-2 rounded-full px-2 py-0.5 text-[8px] ${
                  tab === "submissions"
                    ? "bg-[#171717] text-white"
                    : "bg-black/[0.06] text-black/35"
                }`}
              >
                12
              </span>
            </TabButton>

            <TabButton
              active={tab === "settings"}
              onClick={() => setTab("settings")}
            >
              Settings
            </TabButton>
          </div>

          {tab === "overview" && <OverviewTab />}

          {tab === "submissions" && <SubmissionsTab />}

          {tab === "settings" && (
            <SettingsTab
              requestStatus={requestStatus}
              setRequestStatus={setRequestStatus}
            />
          )}
        </section>
      </div>
    </main>
  );
}

/* OVERVIEW */

function OverviewTab() {
  return (
    <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_330px]">
      <div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-black/30">
              Requirements
            </p>

            <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em]">
              Yang diminta
            </h2>
          </div>

          <p className="text-[9px] font-semibold text-black/30">
            {requirements.length} kebutuhan
          </p>
        </div>

        <div className="mt-4 overflow-hidden rounded-[20px] border border-black/[0.07] bg-white">
          {requirements.map((item, index) => (
            <div
              key={item.title}
              className="flex items-start gap-4 border-b border-black/[0.06] p-5 last:border-0"
            >
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#f1f1ed] text-[9px] font-bold text-black/35">
                {String(index + 1).padStart(2, "0")}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                  <div>
                    <p className="text-xs font-semibold">
                      {item.title}
                    </p>

                    <p className="mt-1.5 text-[10px] leading-5 text-black/35">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <span className="rounded-full bg-[#f5f5f1] px-2.5 py-1.5 text-[8px] font-semibold text-black/35">
                      {item.type}
                    </span>

                    {item.required && (
                      <span className="rounded-full bg-red-50 px-2.5 py-1.5 text-[8px] font-semibold text-red-500">
                        Wajib
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <aside className="space-y-4">
        <div className="rounded-[20px] border border-black/[0.07] bg-white p-5">
          <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-black/30">
            Completion
          </p>

          <div className="mt-5 flex items-end justify-between">
            <div>
              <p className="text-[30px] font-semibold tracking-[-0.05em]">
                67%
              </p>

              <p className="mt-1 text-[9px] text-black/30">
                8 dari 12 submission selesai
              </p>
            </div>

            <div className="grid h-10 w-10 place-items-center rounded-full bg-emerald-50 text-emerald-700">
              <CheckIcon />
            </div>
          </div>

          <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-black/[0.06]">
            <div className="h-full w-[67%] rounded-full bg-[#171717]" />
          </div>
        </div>

        <div className="rounded-[20px] border border-black/[0.07] bg-white p-5">
          <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-black/30">
            Activity
          </p>

          <div className="mt-5 space-y-5">
            <Activity
              title="Submission baru"
              text="PT Sinar Digital Indonesia"
              time="14:32"
            />

            <Activity
              title="Submission baru"
              text="PT Nusantara Kreatif"
              time="11:08"
            />

            <Activity
              title="Submission selesai"
              text="PT Arunika Teknologi"
              time="Kemarin"
            />
          </div>
        </div>
      </aside>
    </div>
  );
}

/* SUBMISSIONS */

function SubmissionsTab() {
  return (
    <div className="mt-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-black/30">
            Responses
          </p>

          <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em]">
            Submission terbaru
          </h2>
        </div>

        <Link
          href="/submissions"
          className="text-[10px] font-semibold text-black/40 transition hover:text-black"
        >
          Lihat semua submissions →
        </Link>
      </div>

      <div className="mt-4 overflow-hidden rounded-[20px] border border-black/[0.07] bg-white">
        {submissions.map((submission) => (
          <div
            key={submission.id}
            className="flex flex-col gap-4 border-b border-black/[0.06] p-5 last:border-0 sm:flex-row sm:items-center"
          >
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#f0f0ec] text-[9px] font-bold text-black/50">
                {submission.initials}
              </div>

              <div className="min-w-0">
                <p className="truncate text-xs font-semibold">
                  {submission.company}
                </p>

                <p className="mt-1 text-[9px] text-black/30">
                  {submission.id} · {submission.submittedAt}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 sm:justify-end">
              <SubmissionStatus status={submission.status} />

              <Link
                href={`/submissions/${submission.id}`}
                className="flex h-9 items-center gap-2 rounded-xl border border-black/[0.08] px-3 text-[9px] font-semibold text-black/45 transition hover:text-black"
              >
                Review
                <ArrowIcon />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* SETTINGS */

function SettingsTab({
  requestStatus,
  setRequestStatus,
}: {
  requestStatus: RequestStatus;
  setRequestStatus: (status: RequestStatus) => void;
}) {
  return (
    <div className="mt-7 max-w-[760px] space-y-4">
      <div className="rounded-[20px] border border-black/[0.07] bg-white p-5 sm:p-6">
        <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-black/30">
          Request Status
        </p>

        <h2 className="mt-2 text-lg font-semibold tracking-[-0.03em]">
          Kontrol request
        </h2>

        <p className="mt-2 text-[10px] leading-5 text-black/35">
          Atur apakah link request masih dapat menerima submission baru.
        </p>

        <div className="mt-6 grid gap-2 sm:grid-cols-3">
          <StatusOption
            active={requestStatus === "active"}
            title="Aktif"
            description="Menerima submission"
            onClick={() => setRequestStatus("active")}
          />

          <StatusOption
            active={requestStatus === "paused"}
            title="Pause"
            description="Jeda sementara"
            onClick={() => setRequestStatus("paused")}
          />

          <StatusOption
            active={requestStatus === "closed"}
            title="Ditutup"
            description="Tidak menerima lagi"
            danger
            onClick={() => setRequestStatus("closed")}
          />
        </div>
      </div>

      <div className="rounded-[20px] border border-black/[0.07] bg-white p-5 sm:p-6">
        <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-black/30">
          Request Information
        </p>

        <div className="mt-5 divide-y divide-black/[0.06]">
          <SettingRow label="Request ID" value="LR-001" />
          <SettingRow label="Template" value="Registrasi Vendor" />
          <SettingRow label="Dibuat" value="25 September 2026" />
          <SettingRow label="Public token" value="a8F2kP" />
        </div>
      </div>

      <div className="rounded-[20px] border border-red-500/15 bg-red-50/50 p-5 sm:p-6">
        <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-red-400">
          Danger Zone
        </p>

        <div className="mt-3 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-semibold">
              Tutup request secara permanen
            </p>

            <p className="mt-1 text-[9px] leading-5 text-black/35">
              Link tidak akan menerima submission baru.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setRequestStatus("closed")}
            className="h-10 shrink-0 rounded-xl bg-red-500 px-4 text-[10px] font-semibold text-white"
          >
            Tutup Request
          </button>
        </div>
      </div>
    </div>
  );
}

/* COMPONENTS */

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-11 shrink-0 items-center border-b-2 px-4 text-[10px] font-semibold transition ${
        active
          ? "border-[#171717] text-[#171717]"
          : "border-transparent text-black/30 hover:text-black"
      }`}
    >
      {children}
    </button>
  );
}

function HeroStat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div>
      <p className="text-xl font-semibold tracking-[-0.04em] sm:text-2xl">
        {value}
      </p>

      <p className="mt-1.5 text-[8px] leading-4 text-white/35 sm:text-[9px]">
        {label}
      </p>
    </div>
  );
}

function Activity({
  title,
  text,
  time,
}: {
  title: string;
  text: string;
  time: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#171717]" />

      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold">{title}</p>

        <p className="mt-1 truncate text-[9px] text-black/35">
          {text}
        </p>
      </div>

      <span className="shrink-0 text-[8px] text-black/25">
        {time}
      </span>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: RequestStatus;
}) {
  const data = {
    active: {
      label: "Aktif",
      style: "bg-emerald-50 text-emerald-700",
    },
    paused: {
      label: "Pause",
      style: "bg-amber-50 text-amber-700",
    },
    closed: {
      label: "Ditutup",
      style: "bg-red-50 text-red-600",
    },
  };

  return (
    <span
      className={`hidden rounded-full px-2.5 py-1 text-[8px] font-semibold sm:inline-flex ${data[status].style}`}
    >
      {data[status].label}
    </span>
  );
}

function SubmissionStatus({
  status,
}: {
  status: string;
}) {
  const completed = status === "Selesai";

  return (
    <span
      className={`rounded-full px-2.5 py-1.5 text-[8px] font-semibold ${
        completed
          ? "bg-emerald-50 text-emerald-700"
          : "bg-amber-50 text-amber-700"
      }`}
    >
      {status}
    </span>
  );
}

function StatusOption({
  active,
  title,
  description,
  danger = false,
  onClick,
}: {
  active: boolean;
  title: string;
  description: string;
  danger?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[15px] border p-4 text-left transition ${
        active
          ? danger
            ? "border-red-500/30 bg-red-50"
            : "border-black/30 bg-[#f7f7f4]"
          : "border-black/[0.07] hover:border-black/15"
      }`}
    >
      <div className="flex items-center justify-between">
        <p
          className={`text-[10px] font-semibold ${
            danger && active ? "text-red-600" : ""
          }`}
        >
          {title}
        </p>

        <div
          className={`grid h-4 w-4 place-items-center rounded-full border ${
            active
              ? danger
                ? "border-red-500 bg-red-500"
                : "border-[#171717] bg-[#171717]"
              : "border-black/15"
          }`}
        >
          {active && (
            <div className="h-1.5 w-1.5 rounded-full bg-white" />
          )}
        </div>
      </div>

      <p className="mt-1.5 text-[8px] text-black/30">
        {description}
      </p>
    </button>
  );
}

function SettingRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-5 py-4 first:pt-0 last:pb-0">
      <p className="text-[10px] text-black/35">{label}</p>

      <p className="text-right text-[10px] font-semibold">
        {value}
      </p>
    </div>
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

function EditIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 20h4L19 9l-4-4L4 16v4Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="m13.5 6.5 4 4"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <circle cx="5" cy="12" r="1.5" fill="currentColor" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <circle cx="19" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="m10 14 4-4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M8.5 16.5 7 18a4 4 0 0 1-5.7-5.6l3-3a4 4 0 0 1 5.7 0"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="m15.5 7.5 1.5-1.5a4 4 0 1 1 5.7 5.6l-3 3a4 4 0 0 1-5.7 0"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <rect
        x="8"
        y="8"
        width="11"
        height="11"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="m6 12 4 4 8-8"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <circle
        cx="18"
        cy="5"
        r="2.5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle
        cx="6"
        cy="12"
        r="2.5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle
        cx="18"
        cy="19"
        r="2.5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="m8.3 10.9 7.4-4.7M8.3 13.1l7.4 4.7"
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

function PauseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M9 6v12M15 6v12"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="m8 5 11 7-11 7V5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseRequestIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="12"
        r="8"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="m9 9 6 6M15 9l-6 6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12h14M14 7l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}