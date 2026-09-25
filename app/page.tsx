"use client";

import { useState } from "react";
import Link from "next/link";

type RequestStatus = "Aktif" | "Selesai" | "Draft";

type RequestItem = {
  id: string;
  name: string;
  type: string;
  submissions: number;
  completed: number;
  status: RequestStatus;
  updated: string;
};

const requests: RequestItem[] = [
  {
    id: "LR-001",
    name: "Registrasi Vendor",
    type: "Vendor",
    submissions: 12,
    completed: 8,
    status: "Aktif",
    updated: "Hari ini",
  },
  {
    id: "LR-002",
    name: "Client Onboarding",
    type: "Client",
    submissions: 5,
    completed: 5,
    status: "Selesai",
    updated: "Kemarin",
  },
  {
    id: "LR-003",
    name: "Peserta Training",
    type: "Training",
    submissions: 24,
    completed: 18,
    status: "Aktif",
    updated: "2 hari lalu",
  },
  {
    id: "LR-004",
    name: "Dokumen Karyawan Baru",
    type: "Employee",
    submissions: 0,
    completed: 0,
    status: "Draft",
    updated: "3 hari lalu",
  },
];

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#f7f7f4] text-[#171717]">
      {/* MOBILE HEADER */}
      <header className="flex h-16 items-center justify-between border-b border-black/[0.06] bg-white px-5 lg:hidden">
        <Link href="/" aria-label="Laroa home">
          <Logo />
        </Link>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="grid h-10 w-10 place-items-center rounded-xl border border-black/[0.08]"
          aria-label="Buka menu"
        >
          <MenuIcon />
        </button>
      </header>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="border-b border-black/[0.06] bg-white px-5 py-4 lg:hidden">
          <nav className="space-y-1">
            <MobileNavItem
              label="Overview"
              href="/"
              active
              onNavigate={() => setMobileMenuOpen(false)}
            />

            <MobileNavItem
              label="Requests"
              href="/requests"
              onNavigate={() => setMobileMenuOpen(false)}
            />

            <MobileNavItem
              label="Submissions"
              href="/submissions"
              onNavigate={() => setMobileMenuOpen(false)}
            />

            <MobileNavItem label="Templates" comingSoon />

            <MobileNavItem label="Settings" comingSoon />
          </nav>
        </div>
      )}

      {/* DESKTOP SIDEBAR */}
      <aside className="fixed bottom-0 left-0 top-0 hidden w-[250px] flex-col border-r border-black/[0.06] bg-white lg:flex">
        <div className="flex h-20 items-center px-7">
          <Link href="/" aria-label="Laroa home">
            <Logo />
          </Link>
        </div>

        <div className="px-4 pt-5">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-black/30">
            Workspace
          </p>

          <nav className="space-y-1">
            <NavItem
              icon={<HomeIcon />}
              label="Overview"
              href="/"
              active
            />

            <NavItem
              icon={<RequestIcon />}
              label="Requests"
              href="/requests"
            />

            <NavItem
              icon={<SubmissionIcon />}
              label="Submissions"
              href="/submissions"
            />

            <NavItem
              icon={<TemplateIcon />}
              label="Templates"
              comingSoon
            />
          </nav>
        </div>

        <div className="mt-auto px-4 pb-5">
          <div className="mb-4 border-t border-black/[0.06] pt-4">
            <NavItem
              icon={<SettingsIcon />}
              label="Settings"
              comingSoon
            />
          </div>

          <div className="flex items-center gap-3 rounded-2xl px-3 py-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#171717] text-xs font-semibold text-white">
              DH
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                Deary
              </p>

              <p className="truncate text-xs text-black/40">
                Noctara
              </p>
            </div>

            <button
              type="button"
              className="ml-auto text-black/20"
              aria-label="Account menu belum tersedia"
              title="Segera"
            >
              <DotsIcon />
            </button>
          </div>
        </div>
      </aside>

      {/* CONTENT */}
      <div className="lg:pl-[250px]">
        {/* TOP BAR */}
        <header className="hidden h-20 items-center justify-between border-b border-black/[0.06] bg-white/80 px-8 backdrop-blur-xl lg:flex xl:px-12">
          <p className="text-sm font-medium text-black/40">
            Overview
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-xl border border-black/[0.07] bg-white text-black/40"
              aria-label="Notifikasi"
              title="Segera"
            >
              <BellIcon />
            </button>

            <Link
              href="/requests/new"
              className="flex h-10 items-center gap-2 rounded-xl bg-[#171717] px-4 text-sm font-semibold text-white transition hover:bg-black/80"
            >
              <PlusIcon />
              Buat Request
            </Link>
          </div>
        </header>

        <div className="mx-auto max-w-[1500px] px-5 py-8 sm:px-7 lg:px-8 lg:py-10 xl:px-12">
          {/* INTRO */}
          <section className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 text-sm font-medium text-black/40">
                Kamis, 25 September
              </p>

              <h1 className="text-[32px] font-semibold tracking-[-0.045em] sm:text-[40px]">
                Selamat datang, Deary.
              </h1>

              <p className="mt-2 max-w-xl text-[15px] leading-6 text-black/45">
                Lihat request yang sedang berjalan dan apa saja yang masih
                perlu diselesaikan.
              </p>
            </div>

            <Link
              href="/requests/new"
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#171717] px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg md:hidden"
            >
              <PlusIcon />
              Buat Request
            </Link>
          </section>

          {/* STATS */}
          <section className="mt-9 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Total request"
              value="12"
              detail="Semua request"
              icon={<RequestIcon />}
            />

            <StatCard
              label="Sedang berjalan"
              value="4"
              detail="Perlu dipantau"
              icon={<ActivityIcon />}
            />

            <StatCard
              label="Selesai"
              value="8"
              detail="67% completion"
              icon={<CheckIcon />}
            />

            <StatCard
              label="Menunggu"
              value="16"
              detail="Dari semua penerima"
              icon={<ClockIcon />}
            />
          </section>

          {/* MAIN GRID */}
          <section className="mt-8 grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
            {/* REQUESTS */}
            <div className="overflow-hidden rounded-[22px] border border-black/[0.06] bg-white">
              <div className="flex items-center justify-between border-b border-black/[0.06] px-5 py-5 sm:px-6">
                <div>
                  <h2 className="text-base font-semibold tracking-[-0.02em]">
                    Request terbaru
                  </h2>

                  <p className="mt-1 text-xs text-black/40">
                    Aktivitas terbaru dari workspace Anda.
                  </p>
                </div>

                <Link
                  href="/requests"
                  className="text-sm font-semibold text-black/55 transition hover:text-black"
                >
                  Lihat semua
                </Link>
              </div>

              {/* DESKTOP TABLE */}
              <div className="hidden md:block">
                <div className="grid grid-cols-[minmax(220px,1.6fr)_0.7fr_1fr_0.7fr_40px] border-b border-black/[0.05] px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-black/30">
                  <span>Request</span>
                  <span>Status</span>
                  <span>Progress</span>
                  <span>Update</span>
                  <span />
                </div>

                {requests.map((request) => (
                  <RequestRow key={request.id} request={request} />
                ))}
              </div>

              {/* MOBILE LIST */}
              <div className="divide-y divide-black/[0.05] md:hidden">
                {requests.map((request) => (
                  <MobileRequestCard
                    key={request.id}
                    request={request}
                  />
                ))}
              </div>
            </div>

            {/* RIGHT */}
            <div className="space-y-5">
              {/* QUICK START */}
              <div className="rounded-[22px] bg-[#171717] p-6 text-white">
                <div className="flex items-start justify-between">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/10">
                    <SparkIcon />
                  </div>

                  <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/60">
                    Quick start
                  </span>
                </div>

                <h3 className="mt-8 text-[24px] font-semibold leading-[1.08] tracking-[-0.04em]">
                  Buat request
                  <br />
                  pertama Anda.
                </h3>

                <p className="mt-3 text-sm leading-6 text-white/50">
                  Pilih template atau mulai dari kosong. Setelah itu tinggal
                  bagikan satu link.
                </p>

                <Link
                  href="/requests/new"
                  className="mt-7 flex h-11 w-full items-center justify-between rounded-xl bg-white px-4 text-sm font-semibold text-black transition hover:bg-white/90"
                >
                  Buat Request
                  <ArrowIcon />
                </Link>
              </div>

              {/* ACTIVITY */}
              <div className="rounded-[22px] border border-black/[0.06] bg-white p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">
                    Aktivitas terbaru
                  </h3>

                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                </div>

                <div className="mt-6 space-y-5">
                  <ActivityItem
                    title="PT Maju Bersama"
                    detail="menyelesaikan Registrasi Vendor"
                    time="8 menit"
                    done
                  />

                  <ActivityItem
                    title="CV Sejahtera"
                    detail="mengunggah NPWP"
                    time="32 menit"
                  />

                  <ActivityItem
                    title="PT Langgeng"
                    detail="membuka request"
                    time="1 jam"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* CTA STRIP */}
          <section className="mt-5 flex flex-col gap-5 rounded-[22px] border border-black/[0.06] bg-[#efefe9] p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/30">
                Laroa
              </p>

              <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em]">
                Satu link. Semua yang Anda butuhkan.
              </h3>

              <p className="mt-2 text-sm text-black/45">
                Data, dokumen, persetujuan, dan kebutuhan lainnya dalam satu
                alur.
              </p>
            </div>

            <Link
              href="/requests/new"
              className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-black/[0.1] bg-white px-5 text-sm font-semibold transition hover:border-black/20"
            >
              Lihat Template
              <ArrowIcon />
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="grid h-8 w-8 place-items-center rounded-[10px] bg-[#171717] text-[11px] font-bold text-white">
        L
      </div>

      <span className="text-lg font-semibold tracking-[-0.04em]">
        Laroa
      </span>
    </div>
  );
}

function NavItem({
  icon,
  label,
  href,
  active = false,
  comingSoon = false,
}: {
  icon: React.ReactNode;
  label: string;
  href?: string;
  active?: boolean;
  comingSoon?: boolean;
}) {
  const className = `flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
    active
      ? "bg-[#f2f2ee] text-black"
      : comingSoon
        ? "cursor-default text-black/25"
        : "text-black/45 hover:bg-black/[0.025] hover:text-black"
  }`;

  const content = (
    <>
      <span
        className={
          active
            ? "text-black"
            : comingSoon
              ? "text-black/20"
              : "text-black/35"
        }
      >
        {icon}
      </span>

      <span>{label}</span>

      {comingSoon && (
        <span className="ml-auto rounded-full bg-black/[0.04] px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.08em] text-black/25">
          Segera
        </span>
      )}
    </>
  );

  if (comingSoon || !href) {
    return (
      <div className={className} aria-disabled="true">
        {content}
      </div>
    );
  }

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}

function MobileNavItem({
  label,
  href,
  active = false,
  comingSoon = false,
  onNavigate,
}: {
  label: string;
  href?: string;
  active?: boolean;
  comingSoon?: boolean;
  onNavigate?: () => void;
}) {
  const className = `flex w-full items-center rounded-xl px-4 py-3 text-left text-sm font-medium ${
    active
      ? "bg-[#f2f2ee]"
      : comingSoon
        ? "text-black/25"
        : "text-black/50"
  }`;

  const content = (
    <>
      <span>{label}</span>

      {comingSoon && (
        <span className="ml-auto rounded-full bg-black/[0.04] px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.08em] text-black/25">
          Segera
        </span>
      )}
    </>
  );

  if (comingSoon || !href) {
    return (
      <div className={className} aria-disabled="true">
        {content}
      </div>
    );
  }

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={className}
    >
      {content}
    </Link>
  );
}

function StatCard({
  label,
  value,
  detail,
  icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-[20px] border border-black/[0.06] bg-white p-5 sm:p-6">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-black/45">
          {label}
        </p>

        <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#f5f5f1] text-black/45">
          {icon}
        </div>
      </div>

      <p className="mt-6 text-[34px] font-semibold tracking-[-0.05em]">
        {value}
      </p>

      <p className="mt-1 text-xs text-black/35">{detail}</p>
    </div>
  );
}

function RequestRow({ request }: { request: RequestItem }) {
  const progress =
    request.submissions === 0
      ? 0
      : Math.round(
          (request.completed / request.submissions) * 100,
        );

  return (
    <Link
      href={`/requests/${request.id}`}
      className="grid grid-cols-[minmax(220px,1.6fr)_0.7fr_1fr_0.7fr_40px] items-center border-b border-black/[0.05] px-6 py-4 last:border-b-0 transition hover:bg-black/[0.012]"
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">
          {request.name}
        </p>

        <p className="mt-1 text-xs text-black/35">
          {request.id} · {request.type}
        </p>
      </div>

      <Status status={request.status} />

      <div className="pr-8">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="font-medium">
            {request.completed}/{request.submissions}
          </span>

          <span className="text-black/30">{progress}%</span>
        </div>

        <div className="h-1.5 overflow-hidden rounded-full bg-black/[0.06]">
          <div
            className="h-full rounded-full bg-[#171717]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <p className="text-xs text-black/40">
        {request.updated}
      </p>

      <div className="grid h-8 w-8 place-items-center rounded-lg text-black/30">
        <ArrowIcon />
      </div>
    </Link>
  );
}

function MobileRequestCard({
  request,
}: {
  request: RequestItem;
}) {
  const progress =
    request.submissions === 0
      ? 0
      : Math.round(
          (request.completed / request.submissions) * 100,
        );

  return (
    <Link
      href={`/requests/${request.id}`}
      className="block p-5 transition active:bg-black/[0.02]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">
            {request.name}
          </p>

          <p className="mt-1 text-xs text-black/35">
            {request.id} · {request.type}
          </p>
        </div>

        <Status status={request.status} />
      </div>

      <div className="mt-5">
        <div className="mb-2 flex justify-between gap-4 text-xs">
          <span className="font-medium">
            {request.completed}/{request.submissions} selesai
          </span>

          <span className="text-black/35">{progress}%</span>
        </div>

        <div className="h-1.5 overflow-hidden rounded-full bg-black/[0.06]">
          <div
            className="h-full rounded-full bg-[#171717]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-1 text-[10px] font-semibold text-black/35">
        Buka request
        <ArrowIcon />
      </div>
    </Link>
  );
}

function Status({ status }: { status: RequestStatus }) {
  const styles: Record<RequestStatus, string> = {
    Aktif: "bg-emerald-50 text-emerald-700",
    Selesai: "bg-[#f0f0ec] text-black/55",
    Draft: "bg-amber-50 text-amber-700",
  };

  return (
    <span
      className={`w-fit rounded-full px-2.5 py-1 text-[10px] font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function ActivityItem({
  title,
  detail,
  time,
  done = false,
}: {
  title: string;
  detail: string;
  time: string;
  done?: boolean;
}) {
  return (
    <div className="flex gap-3">
      <div
        className={`mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full ${
          done
            ? "bg-emerald-50 text-emerald-600"
            : "bg-[#f4f4f0] text-black/40"
        }`}
      >
        {done ? <CheckSmallIcon /> : <ActivitySmallIcon />}
      </div>

      <div className="min-w-0">
        <p className="text-xs leading-5">
          <span className="font-semibold">{title}</span>{" "}
          <span className="text-black/45">{detail}</span>
        </p>

        <p className="mt-0.5 text-[10px] text-black/30">
          {time} lalu
        </p>
      </div>
    </div>
  );
}

/* ICONS */

function HomeIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 10.8 12 3l9 7.8V21H3V10.8Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M9 21v-6h6v6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RequestIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <rect
        x="4"
        y="3"
        width="16"
        height="18"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M8 8h8M8 12h8M8 16h5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SubmissionIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3v12"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="m7 10 5 5 5-5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 20h14"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TemplateIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <rect
        x="3"
        y="3"
        width="7"
        height="7"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <rect
        x="14"
        y="3"
        width="7"
        height="7"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <rect
        x="3"
        y="14"
        width="7"
        height="7"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <rect
        x="14"
        y="14"
        width="7"
        height="7"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="12"
        r="3"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.4-2.4 1A7 7 0 0 0 14.8 6L14.5 3h-5L9.2 6a7 7 0 0 0-1.7 1.1l-2.4-1-2 3.4L5.1 11a7 7 0 0 0 0 2l-2 1.5 2 3.4 2.4-1A7 7 0 0 0 9.2 18l.3 3h5l.3-3a7 7 0 0 0 1.7-1.1l2.4 1 2-3.4-2-1.5c.1-.3.1-.7.1-1Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ActivityIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 12h4l2-6 4 12 2-6h6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="m8 12 2.6 2.6L16.5 9"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M12 7v5l3 2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <path
        d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M10 20h4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DotsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="5" cy="12" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="19" cy="12" r="1.5" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3 13.5 8.5 19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="m18 16 .7 2.3L21 19l-2.3.7L18 22l-.7-2.3L15 19l2.3-.7L18 16Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
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

function CheckSmallIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <path
        d="m6 12 4 4 8-8"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ActivitySmallIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" fill="currentColor" />
    </svg>
  );
}