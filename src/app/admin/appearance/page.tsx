"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import Container from "@/components/layout/Container";

export default function AdminAppearancePage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [cacheBuster, setCacheBuster] = useState<number>(Date.now());

  const previewUrl = useMemo(
    () => (imageFile ? URL.createObjectURL(imageFile) : null),
    [imageFile]
  );

  async function onSave() {
    if (!imageFile) {
      setError("Please choose an image first.");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const fd = new FormData();
      fd.append("image", imageFile);
      const res = await fetch("/api/admin/hero-image", {
        method: "POST",
        body: fd,
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(data?.error ?? "Upload failed.");
      }
      setSuccess("Hero image updated successfully.");
      setImageFile(null);
      setCacheBuster(Date.now());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="py-10 sm:py-14">
      <Container>
        <div className="rounded-3xl border border-neutral-200/70 bg-white/60 p-6 sm:p-8 shadow-sm">
          <p className="text-xs tracking-widest uppercase text-neutral-600">
            Admin
          </p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-900">
            Appearance Settings
          </h1>
          <p className="mt-3 text-neutral-600 max-w-2xl leading-relaxed">
            Replace the home hero model image shown on the storefront.
          </p>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-4">
              <label className="text-sm font-medium" htmlFor="hero-image">
                Hero image
              </label>
              <input
                id="hero-image"
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                className="w-full text-sm text-neutral-700"
              />
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={onSave}
                  disabled={saving}
                  className="rounded-full bg-gradient-to-br from-[#FFD6E0] to-[#F7B3C2] border border-neutral-200 px-6 py-3 text-sm font-semibold text-neutral-900 hover:shadow-sm transition-shadow disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Hero Image"}
                </button>
                <Link
                  href="/admin"
                  className="rounded-full bg-white/70 border border-neutral-200 px-6 py-3 text-sm font-semibold text-neutral-900 hover:bg-white transition-colors text-center"
                >
                  Back to Admin
                </Link>
              </div>

              {error ? (
                <p className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-4 py-2">
                  {error}
                </p>
              ) : null}
              {success ? (
                <p className="text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2">
                  {success}
                </p>
              ) : null}
            </div>

            <div className="lg:col-span-7">
              <p className="text-sm font-medium text-neutral-700 mb-3">
                Preview
              </p>
              <div className="rounded-3xl border border-neutral-200/70 bg-white/40 p-4 shadow-sm">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-neutral-200/60">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      previewUrl ??
                      `/images/hero-model.png?v=${cacheBuster}`
                    }
                    alt="Current hero image preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

