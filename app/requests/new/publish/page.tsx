"use client";

import Link from "next/link";
import { useState } from "react";

const requestToken = "a8F2kP";
const displayUrl = `laroa.app/r/${requestToken}`;

export default function PublishPage() {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/r/${requestToken}`
        : displayUrl;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      setCopied(false);
    }
  }

  function shareWhatsApp() {
    const url = `${window.location.origin}/r/${requestToken}`;

    const message = `Halo, silakan lengkapi Registrasi Vendor melalui link berikut:\n\n${url}`;

    window.open(
      `https://wa.me/?text=${encodeURIComponent(message)}`,
      "_blank",
    );
  }

  function shareEmail() {
    const url = `${window.location.origin}/r/${requestToken}`;

    const subject = "Registrasi Vendor";
    const body = `Halo,\n\nSilakan lengkapi Registrasi Vendor melalui link berikut:\n\n${url}\n\nTerima kasih.`;

    window.location.href = `mailto:?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  }

  return (
    <main className="min-h-screen bg-[#f7f7f4] text-[#171717]">
      {/* HEADER */}
      <header className="border-b border-black/[0.06] bg-white">
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
            className="text-sm font-semibold text-black/45 transition hover:text-black"
          >
            Selesai
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-[1100px] px-5 pb-20 pt-10 sm:px-7 lg:px-10 lg:pt-14">
        {/* STEPS */}
        <div className="flex items-center justify-center gap-3">
          <Step number="1" label="Template" done />

          <div className="h-px w-8 bg-black/15" />

          <Step number="2" label="Atur request" done />

          <div className="h-px w-8 bg-black/15" />

          <Step number="3" label="Bagikan" active />
        </div>

        {/* SUCCESS */}
        <section className="mx-auto mt-14 max-w-[680px] text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#171717] text-white">
            <CheckIcon />
          </div>

          <p className="mt-7 text-[11px] font-semibold uppercase tracking-[0.18em] text-black/30">
            Request berhasil dibuat
          </p>

          <h1 className="mt-3 text-[38px] font-semibold leading-[1.02] tracking-[-0.05em] sm:text-[48px]">
            Siap dikirim.
          </h1>

          <p className="mx-auto mt-4 max-w-lg text-[15px] leading-7 text-black/45">
            Registrasi Vendor sudah dipublish. Bagikan satu link ini kepada
            vendor yang perlu melengkapinya.
          </p>
        </section>

        {/* SHARE CARD */}
        <section className="mx-auto mt-10 max-w-[720px] overflow-hidden rounded-[26px] border border-black/[0.07] bg-white shadow-[0_20px_70px_rgba(0,0,0,0.05)]">
          <div className="border-b border-black/[0.06] p-5 sm:p-7">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-black/30">
                  Link Request
                </p>

                <p className="mt-2 text-sm font-semibold">
                  Registrasi Vendor
                </p>
              </div>

              <span className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-semibold text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Aktif
              </span>
            </div>

            {/* URL */}
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <div className="flex min-h-12 flex-1 items-center overflow-hidden rounded-xl border border-black/[0.08] bg-[#f8f8f5] px-4">
                <LinkIcon />

                <span className="ml-3 truncate text-sm font-medium text-black/60">
                  {displayUrl}
                </span>
              </div>

              <button
                onClick={copyLink}
                className={`flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition ${
                  copied
                    ? "bg-emerald-600 text-white"
                    : "bg-[#171717] text-white hover:bg-black/80"
                }`}
              >
                {copied ? (
                  <>
                    <SmallCheckIcon />
                    Tersalin
                  </>
                ) : (
                  <>
                    <CopyIcon />
                    Salin Link
                  </>
                )}
              </button>
            </div>

            <p className="mt-3 text-[10px] leading-5 text-black/30">
              Siapa pun yang memiliki link ini dapat membuka request tanpa
              membuat akun.
            </p>
          </div>

          {/* SHARE METHODS */}
          <div className="p-5 sm:p-7">
            <p className="text-xs font-semibold text-black/50">
              Bagikan melalui
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <ShareButton
                icon={<WhatsAppIcon />}
                label="WhatsApp"
                description="Kirim langsung"
                onClick={shareWhatsApp}
              />

              <ShareButton
                icon={<MailIcon />}
                label="Email"
                description="Buka email"
                onClick={shareEmail}
              />

              <ShareButton
                icon={<QrIcon />}
                label="QR Code"
                description="Tampilkan kode"
                onClick={() => {
                  document
                    .getElementById("qr-section")
                    ?.scrollIntoView({
                      behavior: "smooth",
                    });
                }}
              />
            </div>
          </div>
        </section>

        {/* QR + PREVIEW */}
        <section
          id="qr-section"
          className="mx-auto mt-5 grid max-w-[720px] gap-5 md:grid-cols-2"
        >
          {/* QR */}
          <div className="rounded-[22px] border border-black/[0.06] bg-white p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold">QR Code</p>

                <p className="mt-1 text-xs leading-5 text-black/40">
                  Scan untuk membuka request.
                </p>
              </div>

              <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#f3f3ef] text-black/45">
                <QrIcon />
              </div>
            </div>

            <div className="mt-7 flex justify-center">
              <FakeQrCode />
            </div>

            <p className="mt-5 text-center text-[10px] font-medium text-black/30">
              {displayUrl}
            </p>
          </div>

          {/* RECIPIENT */}
          <div className="flex flex-col rounded-[22px] bg-[#171717] p-6 text-white">
            <div className="flex items-start justify-between">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/10">
                <EyeIcon />
              </div>

              <span className="rounded-full bg-white/10 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-white/50">
                Preview
              </span>
            </div>

            <div className="mt-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/35">
                Tampilan penerima
              </p>

              <h2 className="mt-2 text-[23px] font-semibold leading-tight tracking-[-0.04em]">
                Lihat apa yang
                <br />
                akan mereka lihat.
              </h2>

              <p className="mt-3 text-xs leading-5 text-white/45">
                Buka request seperti vendor Anda membukanya dari WhatsApp,
                email, atau QR Code.
              </p>
            </div>

            <Link
              href={`/r/${requestToken}`}
              className="mt-auto flex h-11 items-center justify-between rounded-xl bg-white px-4 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Lihat sebagai penerima
              <ArrowIcon />
            </Link>
          </div>
        </section>

        {/* BOTTOM */}
        <section className="mx-auto mt-10 flex max-w-[720px] flex-col items-center justify-between gap-4 border-t border-black/[0.07] pt-7 sm:flex-row">
          <Link
            href="/requests/new/builder?template=vendor"
            className="text-sm font-semibold text-black/40 transition hover:text-black"
          >
            ← Kembali ke builder
          </Link>

          <Link
            href="/"
            className="flex h-11 items-center gap-2 rounded-xl border border-black/[0.1] bg-white px-5 text-sm font-semibold transition hover:border-black/20"
          >
            Ke Dashboard
            <ArrowIcon />
          </Link>
        </section>
      </div>
    </main>
  );
}

function ShareButton({
  icon,
  label,
  description,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-3 rounded-[16px] border border-black/[0.07] p-3.5 text-left transition hover:-translate-y-0.5 hover:border-black/15 hover:shadow-sm"
    >
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#f4f4f0] text-black/55 transition group-hover:bg-[#171717] group-hover:text-white">
        {icon}
      </div>

      <div>
        <p className="text-xs font-semibold">{label}</p>

        <p className="mt-0.5 text-[9px] text-black/35">
          {description}
        </p>
      </div>
    </button>
  );
}

function Step({
  number,
  label,
  active = false,
  done = false,
}: {
  number: string;
  label: string;
  active?: boolean;
  done?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 ${
        active || done ? "" : "opacity-30"
      }`}
    >
      <div
        className={`grid h-7 w-7 place-items-center rounded-full text-[9px] font-bold ${
          active || done
            ? "bg-[#171717] text-white"
            : "border border-black/20"
        }`}
      >
        {done ? <SmallCheckIcon /> : number}
      </div>

      <span className="hidden text-[10px] font-semibold sm:block">
        {label}
      </span>
    </div>
  );
}

function FakeQrCode() {
  const pattern = [
    "111111101010101111111",
    "100000101110101000001",
    "101110101010101011101",
    "101110100111101011101",
    "101110101001101011101",
    "100000101101101000001",
    "111111101010101111111",
    "000000001101100000000",
    "101011111001111010101",
    "011101001110001101110",
    "110011111011101110011",
    "001110001101110001100",
    "111011101010101011101",
    "000000001111100010010",
    "111111101001111010111",
    "100000101110001110100",
    "101110101011101011111",
    "101110100100111000100",
    "101110101111101111101",
    "100000100010001001010",
    "111111101101111101111",
  ];

  return (
    <div className="rounded-[18px] border border-black/[0.07] bg-white p-3 shadow-sm">
      <div
        className="grid h-[154px] w-[154px]"
        style={{
          gridTemplateColumns: `repeat(${pattern[0].length}, 1fr)`,
        }}
      >
        {pattern.flatMap((row, rowIndex) =>
          row.split("").map((cell, columnIndex) => (
            <div
              key={`${rowIndex}-${columnIndex}`}
              className={cell === "1" ? "bg-[#171717]" : "bg-white"}
            />
          )),
        )}
      </div>
    </div>
  );
}

/* ICONS */

function CheckIcon() {
  return (
    <svg width="25" height="25" viewBox="0 0 24 24" fill="none">
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

function LinkIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      className="shrink-0 text-black/30"
    >
      <path
        d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.2 1.2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <path
        d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.2-1.2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
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

function WhatsAppIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <path
        d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4A8 8 0 1 1 20 11.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />

      <path
        d="M9 8.5c.5 2.7 2.3 4.5 5 5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />

      <path
        d="m4 7 8 6 8-6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function QrIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <rect
        x="3"
        y="3"
        width="7"
        height="7"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.6"
      />

      <rect
        x="14"
        y="3"
        width="7"
        height="7"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.6"
      />

      <rect
        x="3"
        y="14"
        width="7"
        height="7"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.6"
      />

      <path
        d="M14 14h3v3h-3zM18 18h3v3h-3zM18 14h3M14 19v2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
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