"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";

import Container from "@/components/layout/Container";

type AdminProduct = {
  id: number;
  category: (typeof categories)[number]["value"];
  title: string;
  description: string;
  price: number;
  fabric: string;
  imagePath: string | null;
  featured: boolean;
  createdAt: string;
};

const categories = [
  { value: "sarees", label: "Sarees" },
  { value: "blouses", label: "Blouses" },
  { value: "lehenga", label: "Lehengas" },
  { value: "ghagras", label: "Ghagras" },
  { value: "dupattas", label: "Dupattas" },
] as const;

function formatMoney(n: number) {
  if (!Number.isFinite(n)) return "";
  return `₹${n.toFixed(0)}`;
}

export default function AdminProductsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fabric, setFabric] = useState("");
  const [price, setPrice] = useState<string>("");
  const [category, setCategory] = useState<(typeof categories)[number]["value"]>(
    categories[0].value
  );
  const [featured, setFeatured] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const categoryLabel = useMemo(
    () => categories.find((c) => c.value === category)?.label ?? category,
    [category]
  );

  async function loadProducts() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/products");
      if (!res.ok) throw new Error("Failed to load products.");
      const json = (await res.json()) as { products: AdminProduct[] };
      setProducts(json.products);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function resetForm() {
    setSelectedId(null);
    setTitle("");
    setDescription("");
    setFabric("");
    setPrice("");
    setCategory(categories[0].value);
    setFeatured(false);
    setImageFile(null);
  }

  function startEdit(p: AdminProduct) {
    setSelectedId(p.id);
    setTitle(p.title);
    setDescription(p.description);
    setFabric(p.fabric);
    setPrice(String(p.price));
    setCategory(p.category);
    setFeatured(p.featured);
    setImageFile(null); // keep existing image unless user uploads a replacement
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("description", description);
      fd.append("fabric", fabric);
      fd.append("price", price);
      fd.append("category", category);
      fd.append("featured", featured ? "1" : "0");
      if (imageFile) fd.append("image", imageFile);

      const endpoint = selectedId
        ? `/api/admin/products/${selectedId}`
        : `/api/admin/products`;

      const method = selectedId ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        body: fd,
      });

      if (!res.ok) {
        const msg =
          (await res.json().catch(() => null))?.error ?? "Save failed.";
        throw new Error(msg);
      }

      resetForm();
      await loadProducts();
    } catch (e2) {
      setError(e2 instanceof Error ? e2.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id: number) {
    if (!confirm("Delete this product?")) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed.");
      resetForm();
      await loadProducts();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed.");
    } finally {
      setSaving(false);
    }
  }

  const selectedProduct = selectedId
    ? products.find((p) => p.id === selectedId) ?? null
    : null;

  return (
    <section className="py-10 sm:py-14">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-neutral-200/70 bg-white/50 p-5 sm:p-8 shadow-sm">
              <div className="mb-6">
                <p className="text-xs tracking-widest uppercase text-neutral-600">
                  Admin
                </p>
                <h1 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900">
                  Manage Products
                </h1>
                <p className="mt-3 text-sm text-neutral-600">
                  Add products, edit details, and replace images.
                </p>
              </div>

              <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="category">
                      Category
                    </label>
                    <select
                      id="category"
                      value={category}
                      onChange={(e) =>
                        setCategory(e.target.value as typeof category)
                      }
                      className="w-full rounded-2xl border border-neutral-200/80 bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-[#C9A227]/30"
                    >
                      {categories.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="price">
                      Price (INR)
                    </label>
                    <input
                      id="price"
                      inputMode="numeric"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="e.g. 5999"
                      className="w-full rounded-2xl border border-neutral-200/80 bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-[#C9A227]/30"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="title">
                    Title
                  </label>
                  <input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Product title"
                    className="w-full rounded-2xl border border-neutral-200/80 bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-[#C9A227]/30"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    className="text-sm font-medium"
                    htmlFor="description"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="A short, elegant description."
                    rows={3}
                    className="w-full rounded-2xl border border-neutral-200/80 bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-[#C9A227]/30"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="fabric">
                    Fabric
                  </label>
                  <input
                    id="fabric"
                    value={fabric}
                    onChange={(e) => setFabric(e.target.value)}
                    placeholder="e.g. Banarasi Silk"
                    className="w-full rounded-2xl border border-neutral-200/80 bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-[#C9A227]/30"
                    required
                  />
                </div>

                <label className="flex items-center gap-3 select-none">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="h-4 w-4 rounded border-neutral-300"
                  />
                  <span className="text-sm font-medium">Featured product</span>
                </label>

                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="image">
                    Image (optional)
                  </label>
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setImageFile(e.target.files?.[0] ?? null)
                    }
                    className="w-full text-sm text-neutral-700"
                  />

                  <div className="mt-2">
                    {imageFile ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={URL.createObjectURL(imageFile)}
                        alt="Selected upload preview"
                        className="w-full max-w-[280px] rounded-2xl border border-neutral-200/70"
                      />
                    ) : selectedProduct?.imagePath ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={`/${selectedProduct.imagePath}`}
                        alt="Current product image"
                        className="w-full max-w-[280px] rounded-2xl border border-neutral-200/70"
                      />
                    ) : (
                      <div className="w-full max-w-[280px] aspect-[4/3] rounded-2xl border border-dashed border-neutral-200/80 bg-white/30 flex items-center justify-center text-neutral-500 text-sm">
                        No image yet
                      </div>
                    )}
                  </div>
                </div>

                {error ? (
                  <p
                    role="alert"
                    className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-4 py-2"
                  >
                    {error}
                  </p>
                ) : null}

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-full bg-gradient-to-br from-[#FFD6E0] to-[#F7B3C2] border border-neutral-200 px-6 py-3 text-sm sm:text-base font-semibold text-neutral-900 hover:shadow-sm transition-shadow disabled:opacity-60"
                  >
                    {saving
                      ? "Saving..."
                      : selectedId
                        ? `Update (${categoryLabel})`
                        : "Add Product"}
                  </button>
                  {selectedId ? (
                    <button
                      type="button"
                      onClick={resetForm}
                      disabled={saving}
                      className="rounded-full bg-white/70 border border-neutral-200 px-6 py-3 text-sm sm:text-base font-semibold text-neutral-900 hover:bg-white transition-colors disabled:opacity-60"
                    >
                      Cancel
                    </button>
                  ) : null}
                </div>
              </form>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-neutral-200/70 bg-white/50 p-5 sm:p-8 shadow-sm">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900">
                    Existing Products
                  </h2>
                  <p className="mt-2 text-sm text-neutral-600">
                    {loading ? "Loading..." : `${products.length} products`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-full bg-white/70 border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-900 hover:bg-white transition-colors"
                >
                  New
                </button>
              </div>

              {error && products.length === 0 ? (
                <p className="mt-6 text-sm text-rose-700">{error}</p>
              ) : null}

              <div className="mt-6 overflow-auto">
                {products.length ? (
                  <table className="w-full text-left min-w-[640px] border-separate border-spacing-y-3">
                    <thead className="text-xs tracking-widest uppercase text-neutral-500">
                      <tr>
                        <th className="px-3">Image</th>
                        <th className="px-3">Title</th>
                        <th className="px-3">Category</th>
                        <th className="px-3">Price</th>
                        <th className="px-3">Featured</th>
                        <th className="px-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {products.map((p) => (
                        <tr
                          key={p.id}
                          className="bg-white/40 border border-neutral-200/70 rounded-2xl"
                        >
                          <td className="px-3 align-middle">
                            {p.imagePath ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={`/${p.imagePath}`}
                                alt={p.title}
                                className="h-14 w-14 object-cover rounded-xl border border-neutral-200/70"
                              />
                            ) : (
                              <div className="h-14 w-14 rounded-xl border border-dashed border-neutral-200/80 bg-white/25" />
                            )}
                          </td>
                          <td className="px-3 align-middle font-medium text-neutral-900">
                            {p.title}
                          </td>
                          <td className="px-3 align-middle text-neutral-700">
                            {p.category}
                          </td>
                          <td className="px-3 align-middle text-neutral-700">
                            {formatMoney(p.price)}
                          </td>
                          <td className="px-3 align-middle">
                            {p.featured ? (
                              <span className="inline-flex items-center rounded-full bg-[#FFD6E0]/70 border border-neutral-200 px-3 py-1 text-xs font-semibold text-neutral-900">
                                Yes
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full bg-neutral-100 border border-neutral-200 px-3 py-1 text-xs font-semibold text-neutral-600">
                                No
                              </span>
                            )}
                          </td>
                          <td className="px-3 align-middle">
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => startEdit(p)}
                                disabled={saving}
                                className="rounded-full bg-white/70 border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-900 hover:bg-white transition-colors disabled:opacity-60"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => onDelete(p.id)}
                                disabled={saving}
                                className="rounded-full bg-rose-50 border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition-colors disabled:opacity-60"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="mt-6 text-sm text-neutral-600">
                    No products yet. Add your first item on the left.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

