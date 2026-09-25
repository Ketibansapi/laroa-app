"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const supabase = createClient();

      const { error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) {
  console.error("Supabase login error:", signInError);
  setError(signInError.message);
  return;
}

      router.replace("/");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f7f4] px-5 py-8 text-[#171717]">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
        <div className="w-full max-w-[430px]">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#171717] text-lg font-semibold text-white">
              L
            </div>

            <h1 className="text-3xl font-semibold tracking-[-0.04em]">
              Selamat datang kembali
            </h1>

            <p className="mt-2 text-sm leading-6 text-black/50">
              Masuk untuk mengelola request dan submission Anda.
            </p>
          </div>

          <div className="rounded-[24px] border border-black/[0.06] bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.04)] sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="nama@perusahaan.com"
                  className="h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm outline-none transition placeholder:text-black/30 focus:border-black/30"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium"
                >
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Masukkan password"
                  className="h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm outline-none transition placeholder:text-black/30 focus:border-black/30"
                />
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center rounded-xl bg-[#171717] px-4 text-sm font-semibold text-white transition hover:bg-black/85 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Memproses..." : "Masuk ke Laroa"}
              </button>
            </form>

            <div className="mt-6 border-t border-black/[0.06] pt-6 text-center">
              <p className="text-xs leading-5 text-black/40">
                Laroa membantu Anda mengumpulkan data, dokumen,
                dan persetujuan melalui satu link.
              </p>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-black/35">
            A product by Noctara
          </p>
        </div>
      </div>
    </main>
  );
}