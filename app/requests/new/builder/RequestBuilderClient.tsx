"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type FieldType = "text" | "file" | "checkbox";

type Requirement = {
  id: number;
  label: string;
  type: FieldType;
  required: boolean;
};

const templateData: Record<
  string,
  {
    title: string;
    description: string;
    requirements: Requirement[];
  }
> = {
  vendor: {
    title: "Registrasi Vendor",
    description:
      "Lengkapi data dan dokumen perusahaan berikut untuk proses registrasi vendor.",
    requirements: [
      {
        id: 1,
        label: "Data perusahaan",
        type: "text",
        required: true,
      },
      {
        id: 2,
        label: "NIB",
        type: "file",
        required: true,
      },
      {
        id: 3,
        label: "NPWP",
        type: "file",
        required: true,
      },
      {
        id: 4,
        label: "Akta Perusahaan",
        type: "file",
        required: true,
      },
      {
        id: 5,
        label: "Persetujuan",
        type: "checkbox",
        required: true,
      },
    ],
  },

  client: {
    title: "Client Onboarding",
    description:
      "Lengkapi informasi berikut agar kami dapat memulai proses onboarding.",
    requirements: [
      {
        id: 1,
        label: "Nama lengkap",
        type: "text",
        required: true,
      },
      {
        id: 2,
        label: "Informasi perusahaan",
        type: "text",
        required: true,
      },
      {
        id: 3,
        label: "Dokumen pendukung",
        type: "file",
        required: false,
      },
      {
        id: 4,
        label: "Persetujuan",
        type: "checkbox",
        required: true,
      },
    ],
  },

  blank: {
    title: "Request Baru",
    description: "",
    requirements: [],
  },
};

export default function RequestBuilderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const templateKey = searchParams.get("template") ?? "blank";
  const initialTemplate =
    templateData[templateKey] ?? templateData.blank;

  const [title, setTitle] = useState(initialTemplate.title);
  const [description, setDescription] = useState(
    initialTemplate.description,
  );
  const [requirements, setRequirements] = useState<Requirement[]>(
    initialTemplate.requirements,
  );

  const [editingId, setEditingId] = useState<number | null>(null);
  const [addMenuOpen, setAddMenuOpen] = useState(false);

  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState("");

  const requiredCount = useMemo(
    () => requirements.filter((item) => item.required).length,
    [requirements],
  );

  function updateRequirement(
    id: number,
    updates: Partial<Requirement>,
  ) {
    setRequirements((current) =>
      current.map((item) =>
        item.id === id ? { ...item, ...updates } : item,
      ),
    );
  }

  function deleteRequirement(id: number) {
    setRequirements((current) =>
      current.filter((item) => item.id !== id),
    );

    if (editingId === id) {
      setEditingId(null);
    }
  }

  function addRequirement(type: FieldType) {
    const newRequirement: Requirement = {
      id: Date.now(),
      label:
        type === "text"
          ? "Pertanyaan baru"
          : type === "file"
            ? "Dokumen baru"
            : "Persetujuan baru",
      type,
      required: true,
    };

    setRequirements((current) => [
      ...current,
      newRequirement,
    ]);

    setEditingId(newRequirement.id);
    setAddMenuOpen(false);
  }

  async function publishRequest() {
    if (publishing) return;

    setPublishError("");

    const cleanTitle = title.trim();
    const cleanDescription = description.trim();

    if (!cleanTitle) {
      setPublishError("Judul request belum diisi.");
      return;
    }

    if (requirements.some((item) => !item.label.trim())) {
      setPublishError(
        "Pastikan semua kebutuhan memiliki nama.",
      );
      return;
    }

    setPublishing(true);

    const supabase = createClient();

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.replace("/login");
        router.refresh();
        return;
      }

      const requestCode = createRequestCode();
      const publicToken = createPublicToken();

      const { data: request, error: requestError } =
        await supabase
          .from("requests")
          .insert({
            owner_id: user.id,
            request_code: requestCode,
            title: cleanTitle,
            type: templateKey,
            status: "active",
            description: cleanDescription || null,
            public_token: publicToken,
          })
          .select("id, request_code, public_token")
          .single();

      if (requestError) {
        throw requestError;
      }

      if (requirements.length > 0) {
        const requirementRows = requirements.map(
          (item, index) => ({
            request_id: request.id,
            label: item.label.trim(),
            field_type: item.type,
            required: item.required,
            position: index,
          }),
        );

        const { error: requirementsError } =
          await supabase
            .from("request_requirements")
            .insert(requirementRows);

        if (requirementsError) {
          const { error: cleanupError } = await supabase
            .from("requests")
            .delete()
            .eq("id", request.id);

          if (cleanupError) {
            console.error(
              "Failed to clean up request:",
              cleanupError,
            );
          }

          throw requirementsError;
        }
      }

      router.push(
        `/requests/new/publish?request=${encodeURIComponent(
          request.id,
        )}&token=${encodeURIComponent(
          request.public_token,
        )}&code=${encodeURIComponent(request.request_code)}`,
      );
    } catch (error) {
      console.error("Publish request error:", error);

      setPublishError(
        "Request belum berhasil dibuat. Silakan coba lagi.",
      );
    } finally {
      setPublishing(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f7f4] text-[#171717]">
      {/* TOP BAR */}
      <header className="sticky top-0 z-40 border-b border-black/[0.06] bg-white/90 backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between px-5 sm:px-7 lg:h-20 lg:px-9">
          <div className="flex items-center gap-4">
            <Link
              href="/requests/new"
              className="grid h-9 w-9 place-items-center rounded-xl text-black/45 transition hover:bg-black/[0.04] hover:text-black"
              aria-label="Kembali"
            >
              <BackIcon />
            </Link>

            <div className="hidden h-6 w-px bg-black/[0.08] sm:block" />

            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">
                  {title || "Request Baru"}
                </span>

                <span className="hidden rounded-full bg-[#f0f0ec] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-black/35 sm:inline-flex">
                  Draft
                </span>
              </div>

              <p className="mt-0.5 hidden text-[10px] text-black/35 sm:block">
                Belum dipublikasikan
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled
              className="hidden h-10 items-center rounded-xl px-4 text-sm font-semibold text-black/25 sm:flex"
              title="Penyimpanan draft akan tersedia nanti"
            >
              Simpan
            </button>

            <button
              type="button"
              onClick={publishRequest}
              disabled={publishing}
              className="flex h-10 items-center gap-2 rounded-xl bg-[#171717] px-4 text-sm font-semibold text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {publishing ? "Publishing..." : "Publish"}

              {!publishing && <ArrowIcon />}
            </button>
          </div>
        </div>
      </header>

      {/* BODY */}
      <div className="grid min-h-[calc(100vh-64px)] lg:min-h-[calc(100vh-80px)] lg:grid-cols-[minmax(0,1fr)_430px]">
        {/* BUILDER */}
        <section className="px-5 py-8 sm:px-8 lg:px-10 lg:py-10 xl:px-14">
          <div className="mx-auto max-w-[760px]">
            {/* STEPS */}
            <div className="mb-10 flex items-center gap-3">
              <Step number="1" label="Template" done />

              <div className="h-px w-8 bg-black/15" />

              <Step number="2" label="Atur request" active />

              <div className="h-px w-8 bg-black/10" />

              <Step number="3" label="Bagikan" />
            </div>

            {/* HEADING */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.17em] text-black/30">
                Request Builder
              </p>

              <h1 className="mt-3 text-[32px] font-semibold tracking-[-0.045em] sm:text-[38px]">
                Atur request Anda.
              </h1>

              <p className="mt-3 max-w-lg text-sm leading-6 text-black/45">
                Tentukan apa saja yang perlu diisi, diunggah, atau
                disetujui oleh penerima.
              </p>
            </div>

            {/* BASIC INFO */}
            <div className="mt-10 rounded-[22px] border border-black/[0.06] bg-white p-5 sm:p-6">
              <div className="mb-6">
                <p className="text-sm font-semibold">
                  Informasi request
                </p>

                <p className="mt-1 text-xs text-black/40">
                  Informasi ini akan terlihat oleh penerima.
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-black/55">
                  Judul request
                </label>

                <input
                  value={title}
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
                  placeholder="Contoh: Registrasi Vendor"
                  className="mt-2 h-12 w-full rounded-xl border border-black/[0.08] bg-[#fafaf8] px-4 text-sm font-medium outline-none transition focus:border-black/25 focus:bg-white"
                />
              </div>

              <div className="mt-5">
                <label className="text-xs font-semibold text-black/55">
                  Deskripsi
                </label>

                <textarea
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  rows={4}
                  placeholder="Jelaskan apa yang perlu dilengkapi..."
                  className="mt-2 w-full resize-none rounded-xl border border-black/[0.08] bg-[#fafaf8] px-4 py-3 text-sm leading-6 outline-none transition focus:border-black/25 focus:bg-white"
                />
              </div>
            </div>

            {/* REQUIREMENTS */}
            <div className="mt-7">
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="text-base font-semibold">
                    Yang perlu dilengkapi
                  </h2>

                  <p className="mt-1 text-xs text-black/40">
                    {requirements.length} kebutuhan ·{" "}
                    {requiredCount} wajib
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2.5">
                {requirements.length === 0 && (
                  <EmptyRequirements />
                )}

                {requirements.map((item, index) => (
                  <RequirementCard
                    key={item.id}
                    item={item}
                    number={index + 1}
                    editing={editingId === item.id}
                    onEdit={() =>
                      setEditingId(
                        editingId === item.id
                          ? null
                          : item.id,
                      )
                    }
                    onChange={(updates) =>
                      updateRequirement(item.id, updates)
                    }
                    onDelete={() =>
                      deleteRequirement(item.id)
                    }
                  />
                ))}
              </div>

              <div className="relative mt-4">
                <button
                  type="button"
                  onClick={() =>
                    setAddMenuOpen((current) => !current)
                  }
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-black/15 bg-white/40 text-sm font-semibold text-black/50 transition hover:border-black/30 hover:bg-white hover:text-black"
                >
                  <PlusIcon />
                  Tambah kebutuhan
                </button>

                {addMenuOpen && (
                  <div className="absolute left-0 right-0 top-[56px] z-30 rounded-[18px] border border-black/[0.07] bg-white p-2 shadow-[0_20px_60px_rgba(0,0,0,0.12)] sm:left-auto sm:w-[330px]">
                    <AddOption
                      icon={<TextIcon />}
                      title="Data / Teks"
                      description="Minta penerima mengisi informasi."
                      onClick={() =>
                        addRequirement("text")
                      }
                    />

                    <AddOption
                      icon={<UploadIcon />}
                      title="Upload Dokumen"
                      description="Minta file, PDF, atau gambar."
                      onClick={() =>
                        addRequirement("file")
                      }
                    />

                    <AddOption
                      icon={<CheckSquareIcon />}
                      title="Persetujuan"
                      description="Minta penerima menyetujui sesuatu."
                      onClick={() =>
                        addRequirement("checkbox")
                      }
                    />
                  </div>
                )}
              </div>
            </div>

            {/* ERROR */}
            {publishError && (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {publishError}
              </div>
            )}

            {/* FOOTER ACTION */}
            <div className="mt-12 flex items-center justify-between border-t border-black/[0.07] pt-6">
              <Link
                href="/requests/new"
                className="text-sm font-semibold text-black/40 transition hover:text-black"
              >
                Kembali
              </Link>

              <button
                type="button"
                onClick={publishRequest}
                disabled={publishing}
                className="flex h-11 items-center gap-3 rounded-xl bg-[#171717] px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
              >
                {publishing
                  ? "Publishing..."
                  : "Lanjutkan"}

                {!publishing && <ArrowIcon />}
              </button>
            </div>
          </div>
        </section>

        {/* PREVIEW */}
        <aside className="hidden border-l border-black/[0.06] bg-[#eeeeea] lg:block">
          <div className="sticky top-20 flex h-[calc(100vh-80px)] flex-col">
            <div className="flex items-center justify-between px-7 py-5">
              <div>
                <p className="text-xs font-semibold">
                  Preview
                </p>

                <p className="mt-1 text-[10px] text-black/35">
                  Tampilan penerima
                </p>
              </div>

              <span className="rounded-full bg-white/70 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.1em] text-black/35">
                Live
              </span>
            </div>

            <div className="flex flex-1 items-center justify-center overflow-y-auto px-7 pb-10">
              <RecipientPreview
                title={title}
                description={description}
                requirements={requirements}
              />
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

function RequirementCard({
  item,
  number,
  editing,
  onEdit,
  onChange,
  onDelete,
}: {
  item: Requirement;
  number: number;
  editing: boolean;
  onEdit: () => void;
  onChange: (updates: Partial<Requirement>) => void;
  onDelete: () => void;
}) {
  return (
    <div
      className={`overflow-hidden rounded-[17px] border bg-white transition ${
        editing
          ? "border-black/20 shadow-[0_10px_35px_rgba(0,0,0,0.05)]"
          : "border-black/[0.06]"
      }`}
    >
      <button
        type="button"
        onClick={onEdit}
        className="flex w-full items-center gap-3 px-4 py-4 text-left sm:px-5"
      >
        <div className="text-black/20">
          <DragIcon />
        </div>

        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#f3f3ef] text-black/45">
          {item.type === "text" && <TextIcon />}
          {item.type === "file" && <UploadIcon />}
          {item.type === "checkbox" && (
            <CheckSquareIcon />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-semibold">
              {item.label}
            </span>

            {item.required && (
              <span className="hidden text-[9px] font-semibold uppercase tracking-[0.1em] text-black/25 sm:inline">
                Wajib
              </span>
            )}
          </div>

          <p className="mt-1 text-[10px] text-black/35">
            {number}. {typeLabel(item.type)}
          </p>
        </div>

        <div
          className={`text-black/30 transition ${
            editing ? "rotate-180" : ""
          }`}
        >
          <ChevronIcon />
        </div>
      </button>

      {editing && (
        <div className="border-t border-black/[0.05] bg-[#fafaf8] px-4 py-5 sm:px-5">
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-[0.12em] text-black/35">
              Nama
            </label>

            <input
              value={item.label}
              onChange={(event) =>
                onChange({
                  label: event.target.value,
                })
              }
              className="mt-2 h-11 w-full rounded-xl border border-black/[0.08] bg-white px-3.5 text-sm font-medium outline-none focus:border-black/25"
            />
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-[0.12em] text-black/35">
                Jenis
              </label>

              <select
                value={item.type}
                onChange={(event) =>
                  onChange({
                    type: event.target.value as FieldType,
                  })
                }
                className="mt-2 h-11 w-full rounded-xl border border-black/[0.08] bg-white px-3 text-sm outline-none focus:border-black/25"
              >
                <option value="text">
                  Data / Teks
                </option>
                <option value="file">
                  Upload Dokumen
                </option>
                <option value="checkbox">
                  Persetujuan
                </option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-semibold uppercase tracking-[0.12em] text-black/35">
                Pengaturan
              </label>

              <button
                type="button"
                onClick={() =>
                  onChange({
                    required: !item.required,
                  })
                }
                className="mt-2 flex h-11 w-full items-center justify-between rounded-xl border border-black/[0.08] bg-white px-3.5"
              >
                <span className="text-sm">
                  Wajib diisi
                </span>

                <Toggle enabled={item.required} />
              </button>
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <button
              type="button"
              onClick={onDelete}
              className="text-xs font-semibold text-red-500/70 transition hover:text-red-600"
            >
              Hapus kebutuhan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function RecipientPreview({
  title,
  description,
  requirements,
}: {
  title: string;
  description: string;
  requirements: Requirement[];
}) {
  return (
    <div className="w-full max-w-[350px] overflow-hidden rounded-[28px] border border-black/[0.08] bg-white shadow-[0_30px_80px_rgba(0,0,0,0.09)]">
      <div className="border-b border-black/[0.06] px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="grid h-6 w-6 place-items-center rounded-[7px] bg-[#171717] text-[8px] font-bold text-white">
              L
            </div>

            <span className="text-xs font-semibold">
              Laroa
            </span>
          </div>

          <span className="text-[9px] text-black/30">
            Secure request
          </span>
        </div>
      </div>

      <div className="p-6">
        <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-black/30">
          Permintaan
        </p>

        <h3 className="mt-2 text-[22px] font-semibold leading-tight tracking-[-0.04em]">
          {title || "Request tanpa judul"}
        </h3>

        <p className="mt-3 text-[11px] leading-5 text-black/45">
          {description ||
            "Tambahkan deskripsi agar penerima mengetahui apa yang perlu dilengkapi."}
        </p>

        <div className="mt-6">
          <div className="mb-2 flex justify-between text-[9px]">
            <span className="font-semibold">
              0 dari {requirements.length} lengkap
            </span>

            <span className="text-black/30">
              0%
            </span>
          </div>

          <div className="h-1 overflow-hidden rounded-full bg-black/[0.07]">
            <div className="h-full w-0 bg-[#171717]" />
          </div>
        </div>

        <div className="mt-6 space-y-2">
          {requirements.length === 0 && (
            <div className="rounded-xl border border-dashed border-black/10 px-4 py-8 text-center">
              <p className="text-[10px] text-black/30">
                Belum ada kebutuhan.
              </p>
            </div>
          )}

          {requirements.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-xl border border-black/[0.06] px-3.5 py-3"
            >
              <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#f4f4f0] text-black/40">
                {item.type === "text" && (
                  <TextIcon />
                )}
                {item.type === "file" && (
                  <UploadIcon />
                )}
                {item.type === "checkbox" && (
                  <CheckSquareIcon />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-[10px] font-semibold">
                  {item.label}
                </p>

                <p className="mt-0.5 text-[8px] text-black/30">
                  {typeLabel(item.type)}
                  {item.required
                    ? " · Wajib"
                    : " · Opsional"}
                </p>
              </div>

              <div className="h-4 w-4 rounded-full border border-black/15" />
            </div>
          ))}
        </div>

        <button
          type="button"
          className="mt-6 h-10 w-full rounded-xl bg-[#171717] text-[10px] font-semibold text-white"
        >
          Mulai Lengkapi
        </button>

        <p className="mt-5 text-center text-[8px] text-black/25">
          Powered by Laroa
        </p>
      </div>
    </div>
  );
}

function EmptyRequirements() {
  return (
    <div className="rounded-[18px] border border-dashed border-black/10 bg-white/50 px-6 py-12 text-center">
      <div className="mx-auto grid h-10 w-10 place-items-center rounded-xl bg-[#efefeb] text-black/35">
        <PlusIcon />
      </div>

      <p className="mt-4 text-sm font-semibold">
        Belum ada kebutuhan
      </p>

      <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-black/35">
        Tambahkan data, dokumen, atau persetujuan yang ingin Anda
        minta.
      </p>
    </div>
  );
}

function AddOption({
  icon,
  title,
  description,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition hover:bg-[#f5f5f1]"
    >
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#f0f0ec] text-black/50">
        {icon}
      </div>

      <div>
        <p className="text-xs font-semibold">
          {title}
        </p>

        <p className="mt-0.5 text-[10px] text-black/35">
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

function Toggle({
  enabled,
}: {
  enabled: boolean;
}) {
  return (
    <div
      className={`relative h-5 w-9 rounded-full transition ${
        enabled ? "bg-[#171717]" : "bg-black/10"
      }`}
    >
      <div
        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition ${
          enabled ? "left-[18px]" : "left-0.5"
        }`}
      />
    </div>
  );
}

function typeLabel(type: FieldType) {
  if (type === "text") return "Data / Teks";
  if (type === "file") return "Upload Dokumen";
  return "Persetujuan";
}

function createRequestCode() {
  const timePart = Date.now()
    .toString(36)
    .slice(-6)
    .toUpperCase();

  const randomPart = Math.random()
    .toString(36)
    .slice(2, 5)
    .toUpperCase();

  return `LR-${timePart}${randomPart}`;
}

function createPublicToken() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID().replaceAll("-", "").slice(0, 16);
  }

  return `${Date.now().toString(36)}${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

/* ICONS */

function BackIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
    >
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

function PlusIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TextIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M5 7h14M5 12h10M5 17h7"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg
      width="15"
      height="15"
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
        d="M5 15v4h14v-4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckSquareIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
    >
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.6"
      />

      <path
        d="m8 12 3 3 5-6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DragIcon() {
  return (
    <svg
      width="14"
      height="18"
      viewBox="0 0 14 18"
      fill="currentColor"
    >
      <circle cx="4" cy="4" r="1.2" />
      <circle cx="10" cy="4" r="1.2" />
      <circle cx="4" cy="9" r="1.2" />
      <circle cx="10" cy="9" r="1.2" />
      <circle cx="4" cy="14" r="1.2" />
      <circle cx="10" cy="14" r="1.2" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="m6 9 6 6 6-6"
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
    <svg
      width="11"
      height="11"
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