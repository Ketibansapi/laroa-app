"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type FieldType = "text" | "file" | "checkbox";

type Requirement = {
  id: string;
  label: string;
  field_type: FieldType;
  required: boolean;
  position: number;
};

type PublicRequest = {
  id: string;
  request_code: string;
  title: string;
  description: string | null;
  type: string;
  status: string;
  requirements: Requirement[];
};

type RequirementValue = string | File | boolean | null;

export default function RecipientRequestPage() {
  const params = useParams<{ token: string }>();
  const token = params.token;

  const [request, setRequest] = useState<PublicRequest | null>(
    null,
  );

  const [values, setValues] = useState<
    Record<string, RequirementValue>
  >({});

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadRequest() {
      if (!token) {
        setLoadError("Link request tidak valid.");
        setLoading(false);
        return;
      }

      const supabase = createClient();

      const { data, error } = await supabase.rpc(
        "get_public_request",
        {
          p_token: token,
        },
      );

      if (cancelled) return;

      if (error) {
        console.error("Load public request error:", error);
        setLoadError(
          "Request tidak dapat dimuat. Silakan periksa kembali link yang Anda terima.",
        );
        setLoading(false);
        return;
      }

      if (!data) {
        setLoadError(
          "Request tidak ditemukan atau sudah tidak aktif.",
        );
        setLoading(false);
        return;
      }

      const publicRequest = data as PublicRequest;

      const initialValues: Record<
        string,
        RequirementValue
      > = {};

      publicRequest.requirements.forEach((requirement) => {
        if (requirement.field_type === "checkbox") {
          initialValues[requirement.id] = false;
          return;
        }

        if (requirement.field_type === "file") {
          initialValues[requirement.id] = null;
          return;
        }

        initialValues[requirement.id] = "";
      });

      setRequest(publicRequest);
      setValues(initialValues);
      setLoading(false);
    }

    loadRequest();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const completedItems = useMemo(() => {
    if (!request) return 0;

    return request.requirements.filter((requirement) =>
      isRequirementComplete(
        requirement,
        values[requirement.id],
      ),
    ).length;
  }, [request, values]);

  const requiredRequirements = useMemo(() => {
    if (!request) return [];

    return request.requirements.filter(
      (requirement) => requirement.required,
    );
  }, [request]);

  const requiredCompleted = useMemo(() => {
    return requiredRequirements.filter((requirement) =>
      isRequirementComplete(
        requirement,
        values[requirement.id],
      ),
    ).length;
  }, [requiredRequirements, values]);

  const totalItems = request?.requirements.length ?? 0;

  const progress =
    totalItems === 0
      ? 100
      : Math.round((completedItems / totalItems) * 100);

  const canSubmit =
    Boolean(request) &&
    requiredCompleted === requiredRequirements.length;

  const documentCount =
    request?.requirements.filter(
      (requirement) => requirement.field_type === "file",
    ).length ?? 0;

  function updateValue(
    requirementId: string,
    value: RequirementValue,
  ) {
    setValues((current) => ({
      ...current,
      [requirementId]: value,
    }));
  }

  function handleSubmit() {
    if (!canSubmit || !request) return;

    /*
      Submission persistence belum kita sambungkan.
      Tahap berikutnya:
      - submissions table
      - answers
      - Supabase Storage
      - file upload
    */

    setSubmitted(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  if (loading) {
    return <RecipientLoading />;
  }

  if (loadError || !request) {
    return (
      <RequestUnavailable
        message={
          loadError ||
          "Request yang Anda cari tidak tersedia."
        }
      />
    );
  }

  if (submitted) {
    return <SuccessScreen request={request} />;
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
              Anda menerima request
            </p>

            <h1 className="mt-4 text-[38px] font-semibold leading-[1.03] tracking-[-0.055em] sm:text-[48px]">
              {request.title}
            </h1>

            <p className="mt-5 max-w-[620px] text-[14px] leading-7 text-black/45 sm:text-[15px]">
              {request.description ||
                "Lengkapi informasi berikut untuk menyelesaikan request ini. Anda tidak perlu membuat akun."}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] font-medium text-black/35">
              <span className="flex items-center gap-2">
                <ClockIcon />± {estimateMinutes(totalItems)} menit
              </span>

              {documentCount > 0 && (
                <span className="flex items-center gap-2">
                  <DocumentIcon />
                  {documentCount}{" "}
                  {documentCount === 1
                    ? "dokumen"
                    : "dokumen"}
                </span>
              )}

              <span className="flex items-center gap-2">
                <LockIcon />
                Data hanya untuk pembuat request
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
            {request.requirements.length === 0 && (
              <div className="rounded-[22px] border border-black/[0.07] bg-white px-6 py-12 text-center">
                <div className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-[#f2f2ee] text-black/35">
                  <DocumentIcon />
                </div>

                <p className="mt-4 text-sm font-semibold">
                  Tidak ada informasi yang perlu dilengkapi
                </p>

                <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-black/35">
                  Request ini tidak memiliki kebutuhan tambahan.
                  Anda dapat langsung mengirimkannya.
                </p>
              </div>
            )}

            {request.requirements.map(
              (requirement, index) => {
                const value = values[requirement.id];

                return (
                  <SectionCard
                    key={requirement.id}
                    number={String(index + 1).padStart(
                      2,
                      "0",
                    )}
                    title={requirement.label}
                    description={requirementDescription(
                      requirement,
                    )}
                    complete={isRequirementComplete(
                      requirement,
                      value,
                    )}
                    required={requirement.required}
                  >
                    {requirement.field_type === "text" && (
                      <TextRequirement
                        requirement={requirement}
                        value={
                          typeof value === "string"
                            ? value
                            : ""
                        }
                        onChange={(newValue) =>
                          updateValue(
                            requirement.id,
                            newValue,
                          )
                        }
                      />
                    )}

                    {requirement.field_type === "file" && (
                      <UploadBox
                        file={
                          value instanceof File
                            ? value
                            : null
                        }
                        onFile={(file) =>
                          updateValue(
                            requirement.id,
                            file,
                          )
                        }
                        onRemove={() =>
                          updateValue(
                            requirement.id,
                            null,
                          )
                        }
                      />
                    )}

                    {requirement.field_type ===
                      "checkbox" && (
                      <AgreementRequirement
                        requirement={requirement}
                        checked={value === true}
                        onChange={(checked) =>
                          updateValue(
                            requirement.id,
                            checked,
                          )
                        }
                      />
                    )}
                  </SectionCard>
                );
              },
            )}
          </div>

          {/* SUBMIT */}
          <section className="mt-6 rounded-[22px] border border-black/[0.07] bg-white p-5 sm:p-6">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm font-semibold">
                  {canSubmit
                    ? "Semua yang wajib sudah lengkap."
                    : `${
                        requiredRequirements.length -
                        requiredCompleted
                      } bagian wajib belum lengkap.`}
                </p>

                <p className="mt-1 text-[10px] leading-5 text-black/35">
                  Periksa kembali informasi Anda sebelum
                  mengirim.
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
                Informasi yang Anda kirim hanya digunakan
                untuk menyelesaikan request ini.
              </p>

              <div className="mt-5 border-t border-black/[0.06] pt-4">
                <p className="text-[9px] leading-4 text-black/25">
                  Request ID
                  <br />
                  <span className="font-semibold text-black/45">
                    {request.request_code}
                  </span>
                </p>
              </div>

              <div className="mt-4 border-t border-black/[0.06] pt-4">
                <p className="text-[9px] leading-4 text-black/25">
                  Powered by{" "}
                  <span className="font-semibold text-black/45">
                    Laroa
                  </span>
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

function TextRequirement({
  requirement,
  value,
  onChange,
}: {
  requirement: Requirement;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Field
      label={requirement.label}
      required={requirement.required}
    >
      <textarea
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={`Isi ${requirement.label.toLowerCase()}`}
        rows={3}
        className="w-full resize-none rounded-xl border border-black/[0.09] bg-[#fafaf8] px-4 py-3.5 text-sm leading-6 outline-none transition placeholder:text-black/20 focus:border-black/30 focus:bg-white"
      />
    </Field>
  );
}

function AgreementRequirement({
  requirement,
  checked,
  onChange,
}: {
  requirement: Requirement;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex w-full items-start gap-4 rounded-[16px] border p-4 text-left transition ${
        checked
          ? "border-[#171717] bg-[#171717] text-white"
          : "border-black/[0.08] bg-[#fafaf8] hover:border-black/20"
      }`}
    >
      <div
        className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border transition ${
          checked
            ? "border-white bg-white text-black"
            : "border-black/20 bg-white"
        }`}
      >
        {checked && <SmallCheckIcon />}
      </div>

      <div>
        <p className="text-xs font-semibold">
          {requirement.label}
        </p>

        <p
          className={`mt-1.5 text-[10px] leading-5 ${
            checked
              ? "text-white/45"
              : "text-black/35"
          }`}
        >
          Centang untuk memberikan persetujuan.
          {!requirement.required &&
            " Persetujuan ini bersifat opsional."}
        </p>
      </div>
    </button>
  );
}

function SectionCard({
  number,
  title,
  description,
  complete,
  required,
  children,
}: {
  number: string;
  title: string;
  description: string;
  complete: boolean;
  required: boolean;
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
            <div className="flex min-w-0 items-center gap-2">
              <h2 className="truncate text-sm font-semibold">
                {title}
              </h2>

              {!required && (
                <span className="shrink-0 rounded-full bg-[#f2f2ee] px-2 py-0.5 text-[8px] font-semibold text-black/30">
                  Opsional
                </span>
              )}
            </div>

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

        {required && (
          <span className="ml-1 text-red-400">*</span>
        )}
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
          <p className="truncate text-xs font-semibold">
            {file.name}
          </p>

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
          const selectedFile =
            event.target.files?.[0];

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

function RecipientLoading() {
  return (
    <main className="min-h-screen bg-[#f7f7f4] text-[#171717]">
      <header className="border-b border-black/[0.06] bg-white">
        <div className="mx-auto flex h-16 max-w-[1180px] items-center px-5 sm:px-7 lg:h-[72px]">
          <div className="flex items-center gap-2.5">
            <div className="grid h-8 w-8 place-items-center rounded-[10px] bg-[#171717] text-[11px] font-bold text-white">
              L
            </div>

            <span className="text-lg font-semibold tracking-[-0.04em]">
              Laroa
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1180px] px-5 py-12 sm:px-7">
        <div className="max-w-[700px] animate-pulse">
          <div className="h-3 w-40 rounded-full bg-black/[0.06]" />

          <div className="mt-5 h-12 w-[70%] rounded-xl bg-black/[0.07]" />

          <div className="mt-5 h-4 w-[85%] rounded-full bg-black/[0.05]" />

          <div className="mt-3 h-4 w-[65%] rounded-full bg-black/[0.05]" />
        </div>

        <div className="mt-12 max-w-[800px] space-y-4">
          <div className="h-48 animate-pulse rounded-[22px] border border-black/[0.05] bg-white" />

          <div className="h-48 animate-pulse rounded-[22px] border border-black/[0.05] bg-white" />

          <div className="h-48 animate-pulse rounded-[22px] border border-black/[0.05] bg-white" />
        </div>
      </div>
    </main>
  );
}

function RequestUnavailable({
  message,
}: {
  message: string;
}) {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f7f7f4] px-5 py-12 text-[#171717]">
      <div className="w-full max-w-[500px] rounded-[26px] border border-black/[0.07] bg-white px-7 py-10 text-center shadow-[0_20px_70px_rgba(0,0,0,0.04)]">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#f2f2ee] text-black/40">
          <LockIcon />
        </div>

        <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.16em] text-black/30">
          Laroa
        </p>

        <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
          Request tidak tersedia
        </h1>

        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-black/40">
          {message}
        </p>

        <p className="mt-8 text-[9px] text-black/25">
          Pastikan Anda menggunakan link yang diberikan oleh
          pembuat request.
        </p>
      </div>
    </main>
  );
}

function SuccessScreen({
  request,
}: {
  request: PublicRequest;
}) {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f7f7f4] px-5 py-12 text-[#171717]">
      <div className="w-full max-w-[570px]">
        <div className="rounded-[28px] border border-black/[0.07] bg-white px-6 py-10 text-center shadow-[0_20px_80px_rgba(0,0,0,0.05)] sm:px-12 sm:py-14">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#171717] text-white">
            <LargeCheckIcon />
          </div>

          <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.17em] text-black/30">
            Siap dikirim
          </p>

          <h1 className="mt-3 text-[36px] font-semibold leading-[1.05] tracking-[-0.05em] sm:text-[44px]">
            Terima kasih.
          </h1>

          <p className="mx-auto mt-4 max-w-[400px] text-[13px] leading-6 text-black/45">
            Semua informasi untuk{" "}
            <span className="font-semibold text-black/65">
              {request.title}
            </span>{" "}
            sudah lengkap.
          </p>

          <div className="mt-8 rounded-[17px] bg-[#f6f6f2] p-4 text-left">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-emerald-600 shadow-sm">
                <SmallCheckIcon />
              </div>

              <div>
                <p className="text-xs font-semibold">
                  {request.title}
                </p>

                <p className="mt-1 text-[9px] text-black/35">
                  {request.request_code}
                </p>
              </div>
            </div>
          </div>

          <p className="mt-8 text-[9px] leading-5 text-black/25">
            Penyimpanan submission akan diaktifkan pada tahap
            berikutnya.
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

function isRequirementComplete(
  requirement: Requirement,
  value: RequirementValue,
) {
  if (requirement.field_type === "text") {
    return (
      typeof value === "string" &&
      value.trim().length > 0
    );
  }

  if (requirement.field_type === "file") {
    return value instanceof File;
  }

  if (requirement.field_type === "checkbox") {
    return value === true;
  }

  return false;
}

function requirementDescription(
  requirement: Requirement,
) {
  if (requirement.field_type === "text") {
    return requirement.required
      ? "Informasi ini wajib dilengkapi."
      : "Informasi ini bersifat opsional.";
  }

  if (requirement.field_type === "file") {
    return requirement.required
      ? "Upload dokumen yang diminta."
      : "Upload dokumen jika tersedia.";
  }

  return requirement.required
    ? "Persetujuan ini diperlukan untuk menyelesaikan request."
    : "Persetujuan ini bersifat opsional.";
}

function estimateMinutes(total: number) {
  if (total <= 2) return 2;
  if (total <= 5) return 5;
  if (total <= 8) return 8;
  return 10;
}

function formatFileSize(bytes: number) {
  if (bytes === 0) return "0 KB";

  if (bytes < 1024 * 1024) {
    return `${Math.max(
      1,
      Math.round(bytes / 1024),
    )} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(
    1,
  )} MB`;
}

/* ICONS */

function SmallCheckIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
    >
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
    <svg
      width="25"
      height="25"
      viewBox="0 0 24 24"
      fill="none"
    >
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
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
    >
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
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
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

function LockIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
    >
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
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
    >
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
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
    >
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
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
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

function TrashIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
    >
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
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
    >
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