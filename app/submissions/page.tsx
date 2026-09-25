"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Status = "Menunggu Review" | "Perlu Revisi" | "Selesai";

type Submission = {
  id: string;
  company: string;
  initials: string;
  request: string;
  submittedAt: string;
  documents: number;
  totalDocuments: number;
  status: Status;
};

const submissions: Submission[] = [
  {
    id: "SUB-001",
    company: "PT Sinar Digital Indonesia",
    initials: "SD",
    request: "Registrasi Vendor",
    submittedAt: "Hari ini, 14:32",
    documents: 3,
    totalDocuments: 3,
    status: "Menunggu Review",
  },
  {
    id: "SUB-002",
    company: "PT Nusantara Kreatif",
    initials: "NK",
    request: "Registrasi Vendor",
    submittedAt: "Hari ini, 11:08",
    documents: 3,
    totalDocuments: 3,
    status: "Menunggu Review",
  },
  {
    id: "SUB-003",
    company: "Arunika Studio",
    initials: "AS",
    request: "Client Onboarding",
    submittedAt: "Kemarin, 16:45",
    documents: 1,
    totalDocuments: 1,
    status: "Selesai",
  },
  {
    id: "SUB-004",
    company: "PT Cipta Solusi Bersama",
    initials: "CS",
    request: "Registrasi Vendor",
    submittedAt: "Kemarin, 10:21",
    documents: 2,
    totalDocuments: 3,
    status: "Perlu Revisi",
  },
  {
    id: "SUB-005",
    company: "Karsa Consulting",
    initials: "KC",
    request: "Client Onboarding",
    submittedAt: "23 Sep, 15:12",
    documents: 1,
    totalDocuments: 1,
    status: "Selesai",
  },
];

type Filter = "Semua" | Status;

export default function SubmissionsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("Semua");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((submission) => {
      const matchesFilter =
        filter === "Semua" || submission.status === filter;

      const keyword = search.toLowerCase().trim();

      const matchesSearch =
        keyword === "" ||
        submission.company.toLowerCase().includes(keyword) ||
        submission.request.toLowerCase().includes(keyword) ||
        submission.id.toLowerCase().includes(keyword);

      return matchesFilter && matchesSearch;
    });
  }, [search, filter]);

  const waitingCount = submissions.filter(
    (item) => item.status === "Menunggu Review",
  ).length;

  const revisionCount = submissions.filter(
    (item) => item.status === "Perlu Revisi",
  ).length;

  const completedCount = submissions.filter(
    (item) => item.status === "Selesai",
  ).length;

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
          aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu"}
        >
          {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </header>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-16 z-30 border-b border-black/[0.06] bg-white p-4 shadow-lg lg:hidden">
          <MobileNavItem
            href="/"
            label="Overview"
            onNavigate={() => setMobileMenuOpen(false)}
          />

          <MobileNavItem
            href="/requests"
            label="Requests"
            onNavigate={() => setMobileMenuOpen(false)}
          />

          <MobileNavItem
            href="/submissions"
            label="Submissions"
            active
            onNavigate={() => setMobileMenuOpen(false)}
          />

          <MobileNavItem label="Templates" comingSoon />
          <MobileNavItem label="Settings" comingSoon />
        </div>
      )}

      {/* DESKTOP SIDEBAR */}
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
          />

          <NavItem
            href="/submissions"
            icon={<InboxIcon />}
            label="Submissions"
            active
            badge={waitingCount}
          />

          <NavItem
            icon={<TemplateIcon />}
            label="Templates"
            comingSoon
          />

          <div className="my-5 border-t border-black/[0.06]" />

          <p className="mb-3 px-4 text-[9px] font-semibold uppercase tracking-[0.15em] text-black/25">
            Account
          </p>

          <NavItem
            icon={<SettingsIcon />}
            label="Settings"
            comingSoon
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

      {/* CONTENT */}
      <div className="lg:pl-[240px]">
        {/* DESKTOP TOPBAR */}
        <header className="hidden h-20 items-center justify-between border-b border-black/[0.06] bg-[#f7f7f4] px-8 lg:flex xl:px-10">
          <div>
            <p className="text-[10px] font-semibold text-black/30">
              Workspace
            </p>

            <p className="mt-1 text-sm font-semibold">
              Submissions
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-xl border border-black/[0.07] bg-white text-black/30"
              aria-label="Notifikasi belum tersedia"
              title="Segera"
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
                Inbox
              </p>

              <h1 className="mt-3 text-[34px] font-semibold tracking-[-0.05em] sm:text-[40px]">
                Submissions
              </h1>

              <p className="mt-2 text-sm leading-6 text-black/40">
                Review data dan dokumen yang dikirim melalui request Anda.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-400" />

              <span className="text-[10px] font-semibold text-black/40">
                {waitingCount} menunggu review
              </span>
            </div>
          </section>

          {/* STATS */}
          <section className="mt-8 grid gap-3 sm:grid-cols-3">
            <StatCard
              label="Menunggu Review"
              value={waitingCount}
              description="Perlu diperiksa"
              icon={<ClockIcon />}
            />

            <StatCard
              label="Perlu Revisi"
              value={revisionCount}
              description="Dikembalikan ke pengirim"
              icon={<RevisionIcon />}
            />

            <StatCard
              label="Selesai"
              value={completedCount}
              description="Sudah disetujui"
              icon={<CheckIcon />}
            />
          </section>

          {/* TABLE CARD */}
          <section className="mt-7 overflow-hidden rounded-[22px] border border-black/[0.07] bg-white">
            {/* TOOLBAR */}
            <div className="flex flex-col gap-4 border-b border-black/[0.06] p-4 sm:p-5 xl:flex-row xl:items-center xl:justify-between">
              <div className="relative w-full xl:max-w-[330px]">
                <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-black/25">
                  <SearchIcon />
                </div>

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Cari perusahaan atau request..."
                  className="h-10 w-full rounded-xl border border-black/[0.08] bg-[#fafaf8] pl-10 pr-4 text-xs outline-none transition placeholder:text-black/25 focus:border-black/20 focus:bg-white"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1 xl:pb-0">
                {(
                  [
                    "Semua",
                    "Menunggu Review",
                    "Perlu Revisi",
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

            {/* DESKTOP TABLE */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-black/[0.06]">
                    <TableHead>Pengirim</TableHead>
                    <TableHead>Request</TableHead>
                    <TableHead>Dokumen</TableHead>
                    <TableHead>Dikirim</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead />
                  </tr>
                </thead>

                <tbody>
                  {filteredSubmissions.map((submission) => (
                    <tr
                      key={submission.id}
                      className="group border-b border-black/[0.05] last:border-0 hover:bg-[#fafaf8]"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#f0f0ec] text-[9px] font-bold text-black/50">
                            {submission.initials}
                          </div>

                          <div>
                            <p className="text-xs font-semibold">
                              {submission.company}
                            </p>

                            <p className="mt-1 text-[9px] font-medium text-black/25">
                              {submission.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-[11px] font-medium text-black/60">
                          {submission.request}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <DocumentIcon />

                          <span className="text-[10px] font-semibold text-black/45">
                            {submission.documents}/
                            {submission.totalDocuments}
                          </span>
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-[10px] font-medium text-black/35">
                        {submission.submittedAt}
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={submission.status} />
                      </td>

                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/submissions/${submission.id}`}
                          className="inline-flex h-9 items-center gap-2 rounded-xl border border-black/[0.08] bg-white px-3 text-[10px] font-semibold transition hover:border-black/20"
                        >
                          Review
                          <ArrowIcon />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE LIST */}
            <div className="divide-y divide-black/[0.06] md:hidden">
              {filteredSubmissions.map((submission) => (
                <Link
                  href={`/submissions/${submission.id}`}
                  key={submission.id}
                  className="block p-5 transition active:bg-[#fafaf8]"
                >
                  <div className="flex items-start gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#f0f0ec] text-[9px] font-bold text-black/50">
                      {submission.initials}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold">
                            {submission.company}
                          </p>

                          <p className="mt-1 text-[9px] text-black/35">
                            {submission.request}
                          </p>
                        </div>

                        <span className="shrink-0 text-black/30">
                          <ArrowIcon />
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <StatusBadge status={submission.status} />

                        <span className="text-[9px] text-black/30">
                          {submission.submittedAt}
                        </span>

                        <span className="text-[9px] text-black/30">
                          {submission.documents}/
                          {submission.totalDocuments} dokumen
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* EMPTY */}
            {filteredSubmissions.length === 0 && (
              <div className="px-5 py-16 text-center">
                <div className="mx-auto grid h-11 w-11 place-items-center rounded-2xl bg-[#f3f3ef] text-black/30">
                  <SearchIcon />
                </div>

                <p className="mt-4 text-sm font-semibold">
                  Submission tidak ditemukan
                </p>

                <p className="mt-1 text-[10px] text-black/35">
                  Coba ubah pencarian atau filter.
                </p>
              </div>
            )}

            {/* FOOTER */}
            <div className="flex items-center justify-between border-t border-black/[0.06] px-5 py-4">
              <p className="text-[9px] text-black/30">
                Menampilkan {filteredSubmissions.length} dari{" "}
                {submissions.length} submission
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
  comingSoon = false,
}: {
  href?: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: number;
  comingSoon?: boolean;
}) {
  const className = `mb-1 flex h-10 items-center gap-3 rounded-xl px-4 text-[11px] font-semibold transition ${
    active
      ? "bg-[#171717] text-white"
      : comingSoon
        ? "cursor-default text-black/25"
        : "text-black/40 hover:bg-[#f5f5f1] hover:text-black"
  }`;

  const content = (
    <>
      <span
        className={
          active
            ? "text-white"
            : comingSoon
              ? "text-black/20"
              : "text-black/35"
        }
      >
        {icon}
      </span>

      <span className="flex-1">{label}</span>

      {comingSoon ? (
        <span className="rounded-full bg-black/[0.04] px-2 py-1 text-[7px] font-bold uppercase tracking-[0.08em] text-black/25">
          Segera
        </span>
      ) : (
        badge !== undefined &&
        badge > 0 && (
          <span
            className={`grid min-w-5 place-items-center rounded-full px-1.5 py-0.5 text-[8px] font-bold ${
              active
                ? "bg-white text-black"
                : "bg-[#171717] text-white"
            }`}
          >
            {badge}
          </span>
        )
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
  href,
  label,
  active = false,
  comingSoon = false,
  onNavigate,
}: {
  href?: string;
  label: string;
  active?: boolean;
  comingSoon?: boolean;
  onNavigate?: () => void;
}) {
  const className = `mb-1 flex items-center rounded-xl px-4 py-3 text-xs font-semibold ${
    active
      ? "bg-[#171717] text-white"
      : comingSoon
        ? "text-black/25"
        : "text-black/50 hover:bg-[#f5f5f1]"
  }`;

  const content = (
    <>
      <span>{label}</span>

      {comingSoon && (
        <span className="ml-auto rounded-full bg-black/[0.04] px-2 py-1 text-[7px] font-bold uppercase tracking-[0.08em] text-black/25">
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

function StatusBadge({ status }: { status: Status }) {
  const styles: Record<Status, string> = {
    "Menunggu Review": "bg-amber-50 text-amber-700",
    "Perlu Revisi": "bg-red-50 text-red-600",
    Selesai: "bg-emerald-50 text-emerald-700",
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
        strokeLinejoin="round"
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

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="12"
        r="8"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M12 8v4l3 2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function RevisionIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
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

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
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

function DocumentIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      className="text-black/30"
    >
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

function CloseIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}