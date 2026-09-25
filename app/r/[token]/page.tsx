"use client";

import { useMemo, useRef, useState } from "react";

type UploadKey = "nib" | "npwp" | "akta";

type UploadState = {
  file: File | null;
};

export default function RecipientRequestPage() {
  const [companyName, setCompanyName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");

  const [uploads, setUploads] = useState<Record<UploadKey, UploadState>>({
    nib: { file: null },
    npwp: { file: null },
    akta: { file: null },
  });

  const [agreement, setAgreement] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const completedItems = useMemo(() => {
    let completed = 0;

    const companyDataComplete =
      companyName.trim() !== "" &&
      businessType.trim() !== "" &&
      companyAddress.trim() !== "";

    if (companyDataComplete) completed += 1;
    if (uploads.nib.file) completed += 1;
    if (uploads.npwp.file) completed += 1;
    if (uploads.akta.file) completed += 1;
    if (agreement) completed += 1;

    return completed;
  }, [
    companyName,
    businessType,
    companyAddress,
    uploads,
    agreement,
  ]);

  const totalItems = 5;
  const progress = Math.round((completedItems / totalItems) * 100);
  const canSubmit = completedItems === totalItems;

  function handleFile(key: UploadKey, file: File | null) {
    if (!file) return;

    setUploads((current) => ({
      ...current,
      [key]: {
        file,
      },
    }));
  }

  function removeFile(key: UploadKey) {
    setUploads((current) => ({
      ...current,
      [key]: {
        file: null,
      },
    }));
  }

  function handleSubmit() {
    if (!canSubmit) return;

    setSubmitted(true);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  if (submitted) {
    return <SuccessScreen companyName={companyName} />;
  }

  return (
    <main className="min-h-screen bg-[#f7f7f4] text-[#171717]">
      {/* TOP */}
      <header className="border-b border-black/[0.06] bg-white">
        <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between px-5 sm:px-7 lg:h-[72px]">
          <div className="flex items-center gap-2.5">
            <div className="grid h-8 w-8 place-items-center rounded-[10px] bg-[#171717] text-[11px] font-bold text-white">
              L
            </div>

            <span className="text-lg font-semibold tracking-[-0.04em]">
              Laroa
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

            <span className="text-[10px] font-semibold text-black/35">
              Link aman
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1180px] gap-8 px-5 pb-24 pt-9 sm:px-7 lg:grid-cols-[1fr_300px] lg:gap-14 lg:pt-14">
        {/* MAIN */}
        <div className="min-w-0">
          {/* INTRO */}
          <section className="max-w-[700px]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-black/30">
              Noctara meminta informasi
            </p>

            <h1 className="mt-4 text-[38px] font-semibold leading-[1.03] tracking-[-0.055em] sm:text-[48px]">
              Registrasi Vendor
            </h1>

            <p className="mt-5 max-w-[620px] text-[14px] leading-7 text-black/45 sm:text-[15px]">
              Lengkapi data dan dokumen perusahaan berikut untuk proses
              registrasi vendor. Anda tidak perlu membuat akun.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] font-medium text-black/35">
              <span className="flex items-center gap-2">
                <ClockIcon />
                ± 5 menit
              </span>

              <span className="flex items-center gap-2">
                <DocumentIcon />
                3 dokumen
              </span>

              <span className="flex items-center gap-2">
                <LockIcon />
                Data hanya untuk Noctara
              </span>
            </div>
          </section>

          {/* MOBILE PROGRESS */}
          <div className="mt-8 lg:hidden">
            <ProgressCard
              completed={completedItems}
              total={totalItems}
              progress={progress}
            />
          </div>

          {/* FORM */}
          <div className="mt-10 space-y-4">
            {/* COMPANY DATA */}
            <SectionCard
              number="01"
              title="Data perusahaan"
              description="Informasi dasar mengenai perusahaan Anda."
              complete={
                companyName.trim() !== "" &&
                businessType.trim() !== "" &&
                companyAddress.trim() !== ""
              }
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Nama perusahaan" required>
                  <input
                    value={companyName}
                    onChange={(event) =>
                      setCompanyName(event.target.value)
                    }
                    placeholder="PT Contoh Indonesia"
                    className="h-12 w-full rounded-xl border border-black/[0.09] bg-[#fafaf8] px-4 text-sm outline-none transition placeholder:text-black/20 focus:border-black/30 focus:bg-white"
                  />
                </Field>

                <Field label="Jenis usaha" required>
                  <input
                    value={businessType}
                    onChange={(event) =>
                      setBusinessType(event.target.value)
                    }
                    placeholder="Software & Technology"
                    className="h-12 w-full rounded-xl border border-black/[0.09] bg-[#fafaf8] px-4 text-sm outline-none transition placeholder:text-black/20 focus:border-black/30 focus:bg-white"
                  />
                </Field>
              </div>

              <div className="mt-5">
                <Field label="Alamat perusahaan" required>
                  <textarea
                    value={companyAddress}
                    onChange={(event) =>
                      setCompanyAddress(event.target.value)
                    }
                    placeholder="Masukkan alamat lengkap perusahaan"
                    rows={3}
                    className="w-full resize-none rounded-xl border border-black/[0.09] bg-[#fafaf8] px-4 py-3.5 text-sm leading-6 outline-none transition placeholder:text-black/20 focus:border-black/30 focus:bg-white"
                  />
                </Field>
              </div>
            </SectionCard>

            {/* NIB */}
            <SectionCard
              number="02"
              title="NIB"
              description="Upload Nomor Induk Berusaha perusahaan."
              complete={Boolean(uploads.nib.file)}
            >
              <UploadBox
                file={uploads.nib.file}
                onFile={(file) => handleFile("nib", file)}
                onRemove={() => removeFile("nib")}
              />
            </SectionCard>

            {/* NPWP */}
            <SectionCard
              number="03"
              title="NPWP"
              description="Upload dokumen NPWP perusahaan."
              complete={Boolean(uploads.npwp.file)}
            >
              <UploadBox
                file={uploads.npwp.file}
                onFile={(file) => handleFile("npwp", file)}
                onRemove={() => removeFile("npwp")}
              />
            </SectionCard>

            {/* AKTA */}
            <SectionCard
              number="04"
              title="Akta Perusahaan"
              description="Upload akta pendirian atau perubahan terakhir."
              complete={Boolean(uploads.akta.file)}
            >
              <UploadBox
                file={uploads.akta.file}
                onFile={(file) => handleFile("akta", file)}
                onRemove={() => removeFile("akta")}
              />
            </SectionCard>

            {/* AGREEMENT */}
            <SectionCard
              number="05"
              title="Persetujuan"
              description="Konfirmasi bahwa informasi yang diberikan sudah benar."
              complete={agreement}
            >
              <button
                type="button"
                onClick={() => setAgreement((value) => !value)}
                className={`flex w-full items-start gap-4 rounded-[16px] border p-4 text-left transition ${
                  agreement
                    ? "border-[#171717] bg-[#171717] text-white"
                    : "border-black/[0.08] bg-[#fafaf8] hover:border-black/20"
                }`}
              >
                <div
                  className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border transition ${
                    agreement
                      ? "border-white bg-white text-black"
                      : "border-black/20 bg-white"
                  }`}
                >
                  {agreement && <SmallCheckIcon />}
                </div>

                <div>
                  <p className="text-xs font-semibold">
                    Saya menyatakan data yang diberikan sudah benar.
                  </p>

                  <p
                    className={`mt-1.5 text-[10px] leading-5 ${
                      agreement ? "text-white/45" : "text-black/35"
                    }`}
                  >
                    Dengan melanjutkan, Anda menyetujui data dan dokumen ini
                    digunakan untuk proses registrasi vendor.
                  </p>
                </div>
              </button>
            </SectionCard>
          </div>

          {/* SUBMIT */}
          <section className="mt-6 rounded-[22px] border border-black/[0.07] bg-white p-5 sm:p-6">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm font-semibold">
                  {canSubmit
                    ? "Semua sudah lengkap."
                    : `${totalItems - completedItems} bagian belum lengkap.`}
                </p>

                <p className="mt-1 text-[10px] leading-5 text-black/35">
                  Periksa kembali sebelum mengirim.
                </p>
              </div>

              <button
                type="button"
                disabled={!canSubmit}
                onClick={handleSubmit}
                className={`flex h-12 min-w-[190px] items-center justify-center gap-2 rounded-xl px-6 text-sm font-semibold transition ${
                  canSubmit
                    ? "bg-[#171717] text-white hover:bg-black/80"
                    : "cursor-not-allowed bg-black/[0.06] text-black/25"
                }`}
              >
                Kirim & Selesaikan
                <ArrowIcon />
              </button>
            </div>
          </section>

          <p className="mt-7 text-center text-[10px] leading-5 text-black/25 lg:hidden">
            Powered by Laroa · A product by Noctara
          </p>
        </div>

        {/* DESKTOP SIDE */}
        <aside className="hidden lg:block">
          <div className="sticky top-10 space-y-4">
            <ProgressCard
              completed={completedItems}
              total={totalItems}
              progress={progress}
            />

            <div className="rounded-[20px] border border-black/[0.06] bg-white p-5">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#f2f2ee] text-black/45">
                <ShieldIcon />
              </div>

              <h3 className="mt-5 text-sm font-semibold">
                Informasi Anda aman
              </h3>

              <p className="mt-2 text-[10px] leading-5 text-black/35">
                Informasi yang Anda kirim hanya dapat dilihat oleh pihak yang
                membuat request ini.
              </p>

              <div className="mt-5 border-t border-black/[0.06] pt-4">
                <p className="text-[9px] leading-4 text-black/25">
                  Powered by{" "}
                  <span className="font-semibold text-black/45">Laroa</span>
                  <br />
                  A product by Noctara
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

function SectionCard({
  number,
  title,
  description,
  complete,
  children,
}: {
  number: string;
  title: string;
  description: string;
  complete: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[22px] border border-black/[0.07] bg-white">
      <div className="flex items-start gap-4 border-b border-black/[0.06] px-5 py-5 sm:px-6">
        <div
          className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-[9px] font-bold transition ${
            complete
              ? "bg-[#171717] text-white"
              : "bg-[#f1f1ed] text-black/35"
          }`}
        >
          {complete ? <SmallCheckIcon /> : number}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-sm font-semibold">{title}</h2>

            {complete && (
              <span className="shrink-0 text-[9px] font-semibold text-emerald-600">
                Lengkap
              </span>
            )}
          </div>

          <p className="mt-1 text-[10px] leading-5 text-black/35">
            {description}
          </p>
        </div>
      </div>

      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-semibold text-black/50">
        {label}
        {required && <span className="ml-1 text-red-400">*</span>}
      </span>

      {children}
    </label>
  );
}

function UploadBox({
  file,
  onFile,
  onRemove,
}: {
  file: File | null;
  onFile: (file: File) => void;
  onRemove: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  if (file) {
    return (
      <div className="flex items-center gap-4 rounded-[16px] border border-emerald-600/20 bg-emerald-50/50 p-4">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-emerald-600 shadow-sm">
          <FileIcon />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold">{file.name}</p>

          <p className="mt-1 text-[9px] text-black/35">
            {formatFileSize(file.size)} · Siap dikirim
          </p>
        </div>

        <button
          type="button"
          onClick={onRemove}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-black/30 transition hover:bg-black/[0.05] hover:text-black"
          aria-label="Hapus file"
        >
          <TrashIcon />
        </button>
      </div>
    );
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={(event) => {
          const selectedFile = event.target.files?.[0];

          if (selectedFile) {
            onFile(selectedFile);
          }

          event.currentTarget.value = "";
        }}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="group flex min-h-[135px] w-full flex-col items-center justify-center rounded-[16px] border border-dashed border-black/[0.14] bg-[#fafaf8] px-5 text-center transition hover:border-black/30 hover:bg-white"
      >
        <div className="grid h-10 w-10 place-items-center rounded-xl border border-black/[0.06] bg-white text-black/40 shadow-sm transition group-hover:text-black">
          <UploadIcon />
        </div>

        <p className="mt-3 text-xs font-semibold">
          Pilih dokumen untuk diupload
        </p>

        <p className="mt-1 text-[9px] text-black/30">
          PDF, JPG atau PNG
        </p>
      </button>
    </>
  );
}

function ProgressCard({
  completed,
  total,
  progress,
}: {
  completed: number;
  total: number;
  progress: number;
}) {
  return (
    <div className="rounded-[20px] border border-black/[0.06] bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-black/30">
            Progress
          </p>

          <p className="mt-2 text-sm font-semibold">
            {completed} dari {total} lengkap
          </p>
        </div>

        <span className="text-[24px] font-semibold tracking-[-0.05em]">
          {progress}%
        </span>
      </div>

      <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-black/[0.06]">
        <div
          className="h-full rounded-full bg-[#171717] transition-all duration-500"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      <p className="mt-4 text-[9px] leading-4 text-black/30">
        Progress tersimpan selama halaman ini tetap terbuka.
      </p>
    </div>
  );
}

function SuccessScreen({
  companyName,
}: {
  companyName: string;
}) {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f7f7f4] px-5 py-12 text-[#171717]">
      <div className="w-full max-w-[570px]">
        <div className="rounded-[28px] border border-black/[0.07] bg-white px-6 py-10 text-center shadow-[0_20px_80px_rgba(0,0,0,0.05)] sm:px-12 sm:py-14">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#171717] text-white">
            <LargeCheckIcon />
          </div>

          <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.17em] text-black/30">
            Berhasil dikirim
          </p>

          <h1 className="mt-3 text-[36px] font-semibold leading-[1.05] tracking-[-0.05em] sm:text-[44px]">
            Terima kasih.
          </h1>

          <p className="mx-auto mt-4 max-w-[400px] text-[13px] leading-6 text-black/45">
            Data dan dokumen{" "}
            {companyName ? (
              <>
                untuk{" "}
                <span className="font-semibold text-black/65">
                  {companyName}
                </span>{" "}
              </>
            ) : null}
            sudah berhasil dikirim ke Noctara.
          </p>

          <div className="mt-8 rounded-[17px] bg-[#f6f6f2] p-4 text-left">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-emerald-600 shadow-sm">
                <SmallCheckIcon />
              </div>

              <div>
                <p className="text-xs font-semibold">
                  Registrasi Vendor
                </p>

                <p className="mt-1 text-[9px] text-black/35">
                  Semua informasi telah diterima
                </p>
              </div>
            </div>
          </div>

          <p className="mt-8 text-[9px] leading-5 text-black/25">
            Anda dapat menutup halaman ini.
          </p>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2">
          <div className="grid h-6 w-6 place-items-center rounded-lg bg-[#171717] text-[8px] font-bold text-white">
            L
          </div>

          <p className="text-[9px] text-black/30">
            Powered by{" "}
            <span className="font-semibold text-black/50">
              Laroa
            </span>{" "}
            · A product by Noctara
          </p>
        </div>
      </div>
    </main>
  );
}

function formatFileSize(bytes: number) {
  if (bytes === 0) return "0 KB";

  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/* ICONS */

function SmallCheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
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

function ClockIcon() {
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
        d="M12 8v4l2.5 1.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
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

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <rect
        x="5"
        y="10"
        width="14"
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />

      <path
        d="M8 10V7a4 4 0 0 1 8 0v3"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3 19 6v5c0 4.5-2.8 7.7-7 10-4.2-2.3-7-5.5-7-10V6l7-3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />

      <path
        d="m9 12 2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 16V5M8 9l4-4 4 4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M5 15v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
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

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 7h16M9 7V4h6v3M8 10v7M12 10v7M16 10v7M6 7l1 14h10l1-14"
        stroke="currentColor"
        strokeWidth="1.5"
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