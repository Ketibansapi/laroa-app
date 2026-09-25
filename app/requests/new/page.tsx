"use client";

import Link from "next/link";
import { useState } from "react";

type TemplateId = "vendor" | "client" | "blank";

const templates = [
  {
    id: "vendor" as TemplateId,
    label: "Registrasi Vendor",
    description:
      "Kumpulkan data perusahaan, NIB, NPWP, akta, dan persetujuan vendor.",
    meta: "5 kebutuhan",
    icon: <BuildingIcon />,
    items: ["Data perusahaan", "NIB", "NPWP", "Akta", "Persetujuan"],
  },
  {
    id: "client" as TemplateId,
    label: "Client Onboarding",
    description:
      "Kumpulkan informasi dan dokumen yang dibutuhkan dari client baru.",
    meta: "4 kebutuhan",
    icon: <UserIcon />,
    items: ["Data client", "Informasi perusahaan", "Dokumen", "Persetujuan"],
  },
  {
    id: "blank" as TemplateId,
    label: "Mulai dari Kosong",
    description:
      "Buat request sendiri dan tentukan apa saja yang perlu dilengkapi.",
    meta: "Custom",
    icon: <PlusLargeIcon />,
    items: [],
  },
];

export default function NewRequestPage() {
  const [selected, setSelected] = useState<TemplateId | null>(null);

  const selectedTemplate = templates.find(
    (template) => template.id === selected,
  );

  return (
    <main className="min-h-screen bg-[#f7f7f4] text-[#171717]">
      {/* TOP BAR */}
      <header className="sticky top-0 z-30 border-b border-black/[0.06] bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 sm:px-7 lg:h-20 lg:px-10">
          <Link
            href="/"
            className="flex items-center gap-2.5 transition-opacity hover:opacity-60"
          >
            <div className="grid h-8 w-8 place-items-center rounded-[10px] bg-[#171717] text-[11px] font-bold text-white">
              L
            </div>

            <span className="text-lg font-semibold tracking-[-0.04em]">
              Laroa
            </span>
          </Link>

          <Link
            href="/"
            className="flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-medium text-black/45 transition hover:bg-black/[0.03] hover:text-black"
          >
            <CloseIcon />
            Tutup
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-[1180px] px-5 pb-20 pt-10 sm:px-7 lg:px-10 lg:pt-16">
        {/* STEP */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-full bg-[#171717] text-[10px] font-bold text-white">
              1
            </div>

            <span className="text-xs font-semibold">Pilih template</span>
          </div>

          <div className="h-px w-10 bg-black/10" />

          <div className="flex items-center gap-2 opacity-30">
            <div className="grid h-7 w-7 place-items-center rounded-full border border-black/20 text-[10px] font-bold">
              2
            </div>

            <span className="hidden text-xs font-semibold sm:block">
              Atur request
            </span>
          </div>

          <div className="h-px w-10 bg-black/10" />

          <div className="flex items-center gap-2 opacity-30">
            <div className="grid h-7 w-7 place-items-center rounded-full border border-black/20 text-[10px] font-bold">
              3
            </div>

            <span className="hidden text-xs font-semibold sm:block">
              Bagikan
            </span>
          </div>
        </div>

        {/* INTRO */}
        <section className="mt-12 max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/30">
            Request baru
          </p>

          <h1 className="mt-4 text-[38px] font-semibold leading-[1.03] tracking-[-0.05em] sm:text-[48px]">
            Apa yang ingin
            <br />
            Anda kumpulkan?
          </h1>

          <p className="mt-5 max-w-lg text-[15px] leading-7 text-black/45">
            Mulai dengan template siap pakai atau buat alur sendiri dari awal.
            Semuanya bisa disesuaikan nanti.
          </p>
        </section>

        {/* TEMPLATE CARDS */}
        <section className="mt-12 grid gap-4 lg:grid-cols-3">
          {templates.map((template) => {
            const isSelected = selected === template.id;

            return (
              <button
                key={template.id}
                onClick={() => setSelected(template.id)}
                className={`group relative flex min-h-[330px] flex-col overflow-hidden rounded-[24px] border p-6 text-left transition-all duration-300 sm:p-7 ${
                  isSelected
                    ? "border-[#171717] bg-white shadow-[0_16px_50px_rgba(0,0,0,0.08)]"
                    : "border-black/[0.07] bg-white hover:-translate-y-1 hover:border-black/15 hover:shadow-[0_16px_50px_rgba(0,0,0,0.05)]"
                }`}
              >
                {/* SELECT */}
                <div className="flex items-start justify-between">
                  <div
                    className={`grid h-12 w-12 place-items-center rounded-[15px] transition ${
                      isSelected
                        ? "bg-[#171717] text-white"
                        : "bg-[#f3f3ef] text-black/60 group-hover:bg-[#171717] group-hover:text-white"
                    }`}
                  >
                    {template.icon}
                  </div>

                  <div
                    className={`grid h-6 w-6 place-items-center rounded-full border transition ${
                      isSelected
                        ? "border-[#171717] bg-[#171717]"
                        : "border-black/15"
                    }`}
                  >
                    {isSelected && <CheckIcon />}
                  </div>
                </div>

                {/* TEXT */}
                <div className="mt-9">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black/30">
                    {template.meta}
                  </p>

                  <h2 className="mt-2 text-[22px] font-semibold tracking-[-0.035em]">
                    {template.label}
                  </h2>

                  <p className="mt-3 max-w-[290px] text-sm leading-6 text-black/45">
                    {template.description}
                  </p>
                </div>

                {/* PREVIEW */}
                <div className="mt-auto pt-7">
                  {template.items.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {template.items.slice(0, 3).map((item) => (
                        <span
                          key={item}
                          className="rounded-lg bg-[#f4f4f0] px-2.5 py-1.5 text-[10px] font-medium text-black/45"
                        >
                          {item}
                        </span>
                      ))}

                      {template.items.length > 3 && (
                        <span className="rounded-lg bg-[#f4f4f0] px-2.5 py-1.5 text-[10px] font-medium text-black/35">
                          +{template.items.length - 3}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-xs font-medium text-black/35">
                      <span className="grid h-5 w-5 place-items-center rounded-md border border-dashed border-black/20">
                        +
                      </span>
                      Tambahkan kebutuhan sendiri
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </section>

        {/* CONTINUE AREA */}
        <section className="mt-7">
          <div
            className={`overflow-hidden rounded-[22px] border transition-all duration-300 ${
              selected
                ? "border-black/[0.07] bg-white opacity-100"
                : "border-transparent bg-transparent opacity-40"
            }`}
          >
            <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div className="flex items-center gap-4">
                <div
                  className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${
                    selected ? "bg-[#f2f2ee]" : "bg-black/[0.03]"
                  }`}
                >
                  {selectedTemplate?.icon ?? <CursorIcon />}
                </div>

                <div>
                  {selectedTemplate ? (
                    <>
                      <p className="text-sm font-semibold">
                        {selectedTemplate.label}
                      </p>

                      <p className="mt-1 text-xs text-black/40">
                        Selanjutnya, sesuaikan isi request Anda.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-semibold">
                        Pilih salah satu untuk melanjutkan
                      </p>

                      <p className="mt-1 text-xs text-black/40">
                        Anda masih bisa mengubah semuanya nanti.
                      </p>
                    </>
                  )}
                </div>
              </div>

              {selected ? (
                <Link
                  href={`/requests/new/builder?template=${selected}`}
                  className="flex h-11 items-center justify-center gap-3 rounded-xl bg-[#171717] px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Lanjutkan
                  <ArrowIcon />
                </Link>
              ) : (
                <button
                  disabled
                  className="flex h-11 cursor-not-allowed items-center justify-center gap-3 rounded-xl bg-black/10 px-5 text-sm font-semibold text-black/30"
                >
                  Lanjutkan
                  <ArrowIcon />
                </button>
              )}
            </div>
          </div>
        </section>

        {/* INFO */}
        <section className="mt-16 border-t border-black/[0.07] pt-8">
          <div className="grid gap-7 md:grid-cols-3">
            <InfoItem
              number="01"
              title="Pilih"
              description="Gunakan template atau mulai dari kosong."
            />

            <InfoItem
              number="02"
              title="Sesuaikan"
              description="Tentukan data, dokumen, dan persetujuan yang dibutuhkan."
            />

            <InfoItem
              number="03"
              title="Bagikan"
              description="Dapatkan satu link dan kirim ke siapa saja."
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function InfoItem({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <span className="pt-0.5 text-[10px] font-semibold text-black/25">
        {number}
      </span>

      <div>
        <p className="text-sm font-semibold">{title}</p>

        <p className="mt-1 max-w-[270px] text-xs leading-5 text-black/40">
          {description}
        </p>
      </div>
    </div>
  );
}

function BuildingIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 21V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v16M17 9h3v12M2 21h20"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 7h2M8 11h2M8 15h2M13 7h1M13 11h1M13 15h1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="8"
        r="4"
        stroke="currentColor"
        strokeWidth="1.6"
      />

      <path
        d="M4.5 21a7.5 7.5 0 0 1 15 0"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PlusLargeIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <path
        d="m6 12 4 4 8-8"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
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
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CursorIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="m5 3 13 9-6 2-3 6L5 3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}