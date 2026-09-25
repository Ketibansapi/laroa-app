"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type RequestStatus = "Aktif" | "Draft" | "Selesai";

type RequestItem = {
  id: string;
  title: string;
  type: string;
  status: RequestStatus;
  submissions: number;
  completed: number;
  createdAt: string;
  token?: string;
};

const requests: RequestItem[] = [
  {
    id: "LR-001",
    title: "Registrasi Vendor",
    type: "Vendor",
    status: "Aktif",
    submissions: 12,
    completed: 8,
    createdAt: "Hari ini",
    token: "a8F2kP",
  },
  {
    id: "LR-002",
    title: "Client Onboarding",
    type: "Client",
    status: "Selesai",
    submissions: 5,
    completed: 5,
    createdAt: "Kemarin",
    token: "c4N8sQ",
  },
  {
    id: "LR-003",
    title: "Peserta Training",
    type: "Training",
    status: "Aktif",
    submissions: 24,
    completed: 18,
    createdAt: "2 hari lalu",
    token: "t7P3mX",
  },
  {
    id: "LR-004",
    title: "Dokumen Karyawan Baru",
    type: "Employee",
    status: "Draft",
    submissions: 0,
    completed: 0,
    createdAt: "3 hari lalu",
  },
];

type Filter = "Semua" | RequestStatus;

export default function RequestsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("Semua");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredRequests = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return requests.filter((request) => {
      const matchesFilter =
        filter === "Semua" || request.status === filter;

      const matchesSearch =
        !keyword ||
        request.title.toLowerCase().includes(keyword) ||
        request.type.toLowerCase().includes(keyword) ||
        request.id.toLowerCase().includes(keyword);

      return matchesFilter && matchesSearch;
    });
  }, [search, filter]);

  const activeCount = requests.filter(
    (request) => request.status === "Aktif",
  ).length;

  const draftCount = requests.filter(
    (request) => request.status === "Draft",
  ).length;

  const totalSubmissions = requests.reduce(
    (total, request) => total + request.submissions,
    0,
  );

  async function copyRequestLink(request: RequestItem) {
    if (!request.token) return;

    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/r/${request.token}`
        : `laroa.app/r/${request.token}`;

    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(request.id);

      window.setTimeout(() => {
        setCopiedId(null);
      }, 1600);
    } catch {
      setCopiedId(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f7f4] text-[#171717]">
      {/* MOBILE HEADER */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-black/[0.06] bg-[#f7f7f4]/95 px-5 backdrop-blur lg:hidden">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo />

          <span className="text-lg font-semibold tracking-[-0.04em]">
            Laroa
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((value) => !value)}
          className="grid h-9 w-9 place-items-center rounded-xl border border-black/[0.08] bg-white"
          aria-label="Buka menu"
        >
          <MenuIcon />
        </button>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-16 z-30 border-b border-black/[0.06] bg-white p-4 shadow-lg lg:hidden">
          <MobileNav href="/" label="Overview" />

          <MobileNav
            href="/requests"
            label="Requests"
            active
          />

          <MobileNav
            href="/submissions"
            label="Submissions"
          />

          <MobileNav
            href="/templates"
            label="Templates"
          />

          <MobileNav
            href="/settings"
            label="Settings"
          />
        </div>
      )}

      {/* SIDEBAR */}
      <aside className="fixed inset-y-0 left-0 hidden w-[240px] border-r border-black/[0.06] bg-white lg:flex lg:flex-col">
        <div className="flex h-20 items-center px-7">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo />

            <span className="text-lg font-semibold tracking-[-0.04em]">
              Laroa
            </span>
          </Link>
        </div>

        <nav className="mt-4 flex-1 px-3">
          <p className="mb-3 px-4 text-[9px] font-semibold uppercase tracking-[0.15em] text-black/25">
            Workspace
          </p>

          <NavItem
            href="/"
            icon={<HomeIcon />}
            label="Overview"
          />

          <NavItem
            href="/requests"
            icon={<RequestsIcon />}
            label="Requests"
            active
          />

          <NavItem
            href="/submissions"
            icon={<InboxIcon />}
            label="Submissions"
            badge={2}
          />

          <NavItem
            href="/templates"
            icon={<TemplateIcon />}
            label="Templates"
          />

          <div className="my-5 border-t border-black/[0.06]" />

          <p className="mb-3 px-4 text-[9px] font-semibold uppercase tracking-[0.15em] text-black/25">
            Account
          </p>

          <NavItem
            href="/settings"
            icon={<SettingsIcon />}
            label="Settings"
          />
        </nav>

        <div className="border-t border-black/[0.06] p-4">
          <div className="flex items-center gap-3 rounded-[14px] p-2">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#171717] text-[10px] font-semibold text-white">
              D
            </div>

            <div className="min-w-0">
              <p className="truncate text-xs font-semibold">
                Deary
              </p>

              <p className="mt-0.5 truncate text-[9px] text-black/35">
                Noctara
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div className="lg:pl-[240px]">
        {/* TOP BAR */}
        <header className="hidden h-20 items-center justify-between border-b border-black/[0.06] px-8 lg:flex xl:px-10">
          <div>
            <p className="text-[10px] font-semibold text-black/30">
              Workspace
            </p>

            <p className="mt-1 text-sm font-semibold">
              Requests
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-xl border border-black/[0.07] bg-white text-black/40 transition hover:text-black"
            >
              <BellIcon />
            </button>

            <Link
              href="/requests/new"
              className="flex h-10 items-center gap-2 rounded-xl bg-[#171717] px-4 text-xs font-semibold text-white transition hover:bg-black/80"
            >
              <PlusIcon />
              Buat Request
            </Link>
          </div>
        </header>

        <div className="mx-auto max-w-[1380px] px-5 pb-20 pt-8 sm:px-7 lg:px-8 lg:pt-10 xl:px-10">
          {/* TITLE */}
          <section className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-black/30">
                Workspace
              </p>

              <h1 className="mt-3 text-[34px] font-semibold tracking-[-0.05em] sm:text-[40px]">
                Requests
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-black/40">
                Buat, bagikan, dan pantau semua request dari satu
                tempat.
              </p>
            </div>

            <Link
              href="/requests/new"
              className="flex h-11 w-fit items-center gap-2 rounded-xl bg-[#171717] px-5 text-xs font-semibold text-white transition hover:bg-black/80 lg:hidden"
            >
              <PlusIcon />
              Buat Request
            </Link>
          </section>

          {/* STATS */}
          <section className="mt-8 grid gap-3 sm:grid-cols-3">
            <StatCard
              label="Request Aktif"
              value={activeCount}
              description="Sedang menerima submission"
              icon={<ActivityIcon />}
            />

            <StatCard
              label="Draft"
              value={draftCount}
              description="Belum dipublish"
              icon={<DraftIcon />}
            />

            <StatCard
              label="Total Submission"
              value={totalSubmissions}
              description="Dari seluruh request"
              icon={<InboxIcon />}
            />
          </section>

          {/* LIST */}
          <section className="mt-7 overflow-hidden rounded-[22px] border border-black/[0.07] bg-white">
            {/* TOOLBAR */}
            <div className="flex flex-col gap-4 border-b border-black/[0.06] p-4 sm:p-5 xl:flex-row xl:items-center xl:justify-between">
              <div className="relative w-full xl:max-w-[330px]">
                <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-black/25">
                  <SearchIcon />
                </div>

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Cari request..."
                  className="h-10 w-full rounded-xl border border-black/[0.08] bg-[#fafaf8] pl-10 pr-4 text-xs outline-none transition placeholder:text-black/25 focus:border-black/20 focus:bg-white"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1 xl:pb-0">
                {(
                  [
                    "Semua",
                    "Aktif",
                    "Draft",
                    "Selesai",
                  ] as Filter[]
                ).map((item) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() => setFilter(item)}
                    className={`shrink-0 rounded-xl px-3.5 py-2 text-[10px] font-semibold transition ${
                      filter === item
                        ? "bg-[#171717] text-white"
                        : "bg-[#f5f5f1] text-black/40 hover:text-black"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* DESKTOP */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-black/[0.06]">
                    <TableHead>Request</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submission</TableHead>
                    <TableHead>Selesai</TableHead>
                    <TableHead>Dibuat</TableHead>
                    <TableHead />
                  </tr>
                </thead>

                <tbody>
                  {filteredRequests.map((request) => (
                    <tr
                      key={request.id}
                      className="border-b border-black/[0.05] last:border-0 hover:bg-[#fafaf8]"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#f0f0ec] text-black/40">
                            <RequestFileIcon />
                          </div>

                          <div>
                            <Link
                              href={`/requests/${request.id}`}
                              className="text-xs font-semibold transition hover:opacity-55"
                            >
                              {request.title}
                            </Link>

                            <div className="mt-1 flex items-center gap-2">
                              <span className="text-[9px] font-medium text-black/25">
                                {request.id}
                              </span>

                              <span className="h-1 w-1 rounded-full bg-black/15" />

                              <span className="text-[9px] text-black/30">
                                {request.type}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={request.status} />
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-[11px] font-semibold text-black/55">
                          {request.submissions}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        {request.submissions > 0 ? (
                          <div className="flex items-center gap-3">
                            <div className="h-1.5 w-[65px] overflow-hidden rounded-full bg-black/[0.06]">
                              <div
                                className="h-full rounded-full bg-[#171717]"
                                style={{
                                  width: `${
                                    (request.completed /
                                      request.submissions) *
                                    100
                                  }%`,
                                }}
                              />
                            </div>

                            <span className="text-[9px] font-semibold text-black/35">
                              {request.completed}/
                              {request.submissions}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-black/20">
                            —
                          </span>
                        )}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-[10px] font-medium text-black/30">
                        {request.createdAt}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          {request.status === "Aktif" &&
                            request.token && (
                              <button
                                type="button"
                                onClick={() =>
                                  copyRequestLink(request)
                                }
                                className={`flex h-9 items-center gap-2 rounded-xl border px-3 text-[9px] font-semibold transition ${
                                  copiedId === request.id
                                    ? "border-emerald-500/20 bg-emerald-50 text-emerald-700"
                                    : "border-black/[0.07] bg-white text-black/40 hover:border-black/15 hover:text-black"
                                }`}
                              >
                                {copiedId === request.id ? (
                                  <>
                                    <CheckIcon />
                                    Tersalin
                                  </>
                                ) : (
                                  <>
                                    <CopyIcon />
                                    Salin Link
                                  </>
                                )}
                              </button>
                            )}

                          <Link
                            href={`/requests/${request.id}`}
                            className="grid h-9 w-9 place-items-center rounded-xl border border-black/[0.07] bg-white text-black/35 transition hover:border-black/15 hover:text-black"
                          >
                            <ArrowIcon />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE */}
            <div className="divide-y divide-black/[0.06] md:hidden">
              {filteredRequests.map((request) => (
                <div key={request.id} className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#f0f0ec] text-black/40">
                      <RequestFileIcon />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <Link
                            href={`/requests/${request.id}`}
                            className="block truncate text-xs font-semibold"
                          >
                            {request.title}
                          </Link>

                          <p className="mt-1 text-[9px] text-black/30">
                            {request.id} · {request.type}
                          </p>
                        </div>

                        <StatusBadge status={request.status} />
                      </div>

                      <div className="mt-5 grid grid-cols-2 gap-3 rounded-[14px] bg-[#f7f7f4] p-3">
                        <div>
                          <p className="text-[9px] text-black/30">
                            Submission
                          </p>

                          <p className="mt-1 text-xs font-semibold">
                            {request.submissions}
                          </p>
                        </div>

                        <div>
                          <p className="text-[9px] text-black/30">
                            Selesai
                          </p>

                          <p className="mt-1 text-xs font-semibold">
                            {request.completed}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex gap-2">
                        {request.status === "Aktif" &&
                          request.token && (
                            <button
                              type="button"
                              onClick={() =>
                                copyRequestLink(request)
                              }
                              className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-black/[0.08] text-[9px] font-semibold"
                            >
                              {copiedId === request.id ? (
                                <>
                                  <CheckIcon />
                                  Tersalin
                                </>
                              ) : (
                                <>
                                  <CopyIcon />
                                  Salin Link
                                </>
                              )}
                            </button>
                          )}

                        <Link
                          href={`/requests/${request.id}`}
                          className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-[#171717] text-[9px] font-semibold text-white"
                        >
                          Buka Request
                          <ArrowIcon />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredRequests.length === 0 && (
              <div className="px-5 py-16 text-center">
                <div className="mx-auto grid h-11 w-11 place-items-center rounded-2xl bg-[#f3f3ef] text-black/30">
                  <SearchIcon />
                </div>

                <p className="mt-4 text-sm font-semibold">
                  Request tidak ditemukan
                </p>

                <p className="mt-1 text-[10px] text-black/35">
                  Coba ubah pencarian atau filter.
                </p>
              </div>
            )}

            <div className="flex items-center justify-between border-t border-black/[0.06] px-5 py-4">
              <p className="text-[9px] text-black/30">
                {filteredRequests.length} dari {requests.length} request
              </p>

              <p className="hidden text-[9px] text-black/25 sm:block">
                Terbaru ditampilkan terlebih dahulu
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

/* COMPONENTS */

function Logo() {
  return (
    <div className="grid h-8 w-8 place-items-center rounded-[10px] bg-[#171717] text-[11px] font-bold text-white">
      L
    </div>
  );
}

function NavItem({
  href,
  icon,
  label,
  active = false,
  badge,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: number;
}) {
  return (
    <Link
      href={href}
      className={`mb-1 flex h-10 items-center gap-3 rounded-xl px-4 text-[11px] font-semibold transition ${
        active
          ? "bg-[#171717] text-white"
          : "text-black/40 hover:bg-[#f5f5f1] hover:text-black"
      }`}
    >
      <span>{icon}</span>
      <span className="flex-1">{label}</span>

      {badge !== undefined && badge > 0 && (
        <span
          className={`grid min-w-5 place-items-center rounded-full px-1.5 py-0.5 text-[8px] font-bold ${
            active
              ? "bg-white text-black"
              : "bg-[#171717] text-white"
          }`}
        >
          {badge}
        </span>
      )}
    </Link>
  );
}

function MobileNav({
  href,
  label,
  active = false,
}: {
  href: string;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`mb-1 block rounded-xl px-4 py-3 text-xs font-semibold ${
        active
          ? "bg-[#171717] text-white"
          : "text-black/50 hover:bg-[#f5f5f1]"
      }`}
    >
      {label}
    </Link>
  );
}

function StatCard({
  label,
  value,
  description,
  icon,
}: {
  label: string;
  value: number;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-[18px] border border-black/[0.06] bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-semibold text-black/35">
            {label}
          </p>

          <p className="mt-3 text-[30px] font-semibold tracking-[-0.05em]">
            {value}
          </p>
        </div>

        <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#f3f3ef] text-black/40">
          {icon}
        </div>
      </div>

      <p className="mt-3 text-[9px] text-black/30">
        {description}
      </p>
    </div>
  );
}

function TableHead({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <th className="whitespace-nowrap px-5 py-3.5 text-left text-[9px] font-semibold uppercase tracking-[0.08em] text-black/25">
      {children}
    </th>
  );
}

function StatusBadge({
  status,
}: {
  status: RequestStatus;
}) {
  const styles: Record<RequestStatus, string> = {
    Aktif: "bg-emerald-50 text-emerald-700",
    Draft: "bg-[#f1f1ed] text-black/40",
    Selesai: "bg-blue-50 text-blue-700",
  };

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1.5 text-[9px] font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

/* ICONS */

function HomeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="m4 10 8-6 8 6v9a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1v-9Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RequestsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M9 8h6M9 12h6M9 16h4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function InboxIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 5h16l1 10v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4L4 5Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M3 15h5l2 3h4l2-3h5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TemplateIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M4 9h16M9 9v11"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="12"
        r="3"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.4-2.4 1A7 7 0 0 0 15 6l-.3-2.6h-4L10.5 6A7 7 0 0 0 9 7.1l-2.4-1-2 3.4 2 1.5a7 7 0 0 0 0 2l-2 1.5 2 3.4 2.4-1A7 7 0 0 0 10.5 18l.3 2.6h4L15 18a7 7 0 0 0 1.5-1.1l2.4 1 2-3.4-2-1.5c.1-.3.1-.7.1-1Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 9a6 6 0 0 1 12 0v5l2 3H4l2-3V9Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M10 20h4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ActivityIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 12h4l2-5 4 10 2-5h4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DraftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 4h10l4 4v12H5V4Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M15 4v5h4M8 13h8M8 16h5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <circle
        cx="11"
        cy="11"
        r="6"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="m16 16 4 4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function RequestFileIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <path
        d="M7 3h7l4 4v14H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M14 3v5h4M9 13h6M9 16h4"
        stroke="currentColor"
        strokeWidth="1.6"
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
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
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

function MenuIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 8h14M5 12h14M5 16h14"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}