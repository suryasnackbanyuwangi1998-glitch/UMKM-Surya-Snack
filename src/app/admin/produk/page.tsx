// src/app/admin/produk/tambah/page.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faImage,
  faSpinner,
  faCheckCircle,
  faArrowLeft,
  faLayerGroup,
} from "@fortawesome/free-solid-svg-icons";

interface ProductVariant {
  name: string;
  price: string;
  stock: string;
  weight: string;
  origin: string;
  image_url: string;
  imageFile?: File | null;
  description?: string;
  ingredients?: string;
  key_features?: string;
  packaging_standard?: string;
  is_popular?: boolean;
}

const REQUEST_TIMEOUT_MS = 15000;

async function compressImageBeforeUpload(file: File): Promise<File> {
  if (
    typeof window === "undefined" ||
    !file?.type?.startsWith("image/") ||
    file.type === "image/gif" ||
    file.size <= 300 * 1024
  ) {
    return file;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const maxDimension = 1200;
      let { width, height } = img;

      if (width > maxDimension || height > maxDimension) {
        if (width >= height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(file);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!blob || blob.size >= file.size) {
            resolve(file);
            return;
          }
          const baseName = file.name.replace(/\.[^/.]+$/, "");
          resolve(
            new File([blob], `${baseName}.jpg`, {
              type: "image/jpeg",
              lastModified: Date.now(),
            })
          );
        },
        "image/jpeg",
        0.8
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };

    img.src = objectUrl;
  });
}

async function fetchWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit = {},
  timeoutMs: number = REQUEST_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(input, {
      ...init,
      signal: controller.signal,
    });
  } catch (err: any) {
    if (err?.name === "AbortError") {
      throw new Error("Proses terlalu lama (timeout). Periksa koneksi lalu coba lagi.");
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

export default function TambahProdukPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [statusStep, setStatusStep] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Form State Utama Produk
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Makanan");
  const [weight, setWeight] = useState("250 gram");
  const [origin, setOrigin] = useState("Banyuwangi");
  const [stock, setStock] = useState("50");
  const [badge, setBadge] = useState("Best Seller");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [packagingStandard, setPackagingStandard] = useState("Mika Plastik Transparan Eksklusif");
  const [keyFeatures, setKeyFeatures] = useState(
    "Tanpa Bahan Pengawet.\nResep Warisan Leluhur.\nGurih & Renyah."
  );
  const [isPopular, setIsPopular] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  const previewUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const compressed = await compressImageBeforeUpload(e.target.files[0]);
      const preview = URL.createObjectURL(compressed);
      previewUrlsRef.current.push(preview);
      setImageFile(compressed);
      setImagePreview(preview);
    }
  };

  const handleAddVariant = () => {
    setVariants([
      ...variants,
      {
        name: "",
        price: "",
        stock: "10",
        weight: "250 gram",
        origin: "Banyuwangi",
        image_url: "",
        imageFile: null,
        description: "",
        ingredients: "",
        key_features: "",
        packaging_standard: "",
        is_popular: false,
      },
    ]);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleVariantChange = (index: number, field: keyof ProductVariant, value: any) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    setVariants(updated);
  };

  const handleVariantImageChange = async (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const compressed = await compressImageBeforeUpload(e.target.files[0]);
      const previewUrl = URL.createObjectURL(compressed);
      previewUrlsRef.current.push(previewUrl);
      const updated = [...variants];
      updated[index] = { ...updated[index], imageFile: compressed, image_url: previewUrl };
      setVariants(updated);
    }
  };

  const uploadToGoogleDrive = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "produk");

    const res = await fetchWithTimeout("/api/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.success) {
      throw new Error(data.error || data.message || "Gagal mengunggah gambar ke Google Drive");
    }
    return data.imageUrl as string;
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    try {
      const hasAnyUpload = Boolean(imageFile || variants.some((v) => v.imageFile));
      if (hasAnyUpload) {
        setStatusStep("Mengunggah foto...");
      }

      // Upload foto utama dan semua foto varian SECARA PARALEL sekaligus
      const [finalImageUrl, processedVariants] = await Promise.all([
        imageFile ? uploadToGoogleDrive(imageFile) : Promise.resolve(""),
        Promise.all(
          variants.map(async (v) => {
            let variantImgUrl = v.image_url;
            if (v.imageFile) {
              variantImgUrl = await uploadToGoogleDrive(v.imageFile);
            } else if (variantImgUrl?.startsWith("blob:")) {
              variantImgUrl = "";
            }
            return {
              name: v.name,
              price: v.price ? parseFloat(v.price) : 0,
              stock: parseInt(v.stock) || 0,
              weight: v.weight || "250 gram",
              origin: v.origin || "Banyuwangi",
              image_url: variantImgUrl || "",
              description: v.description || "",
              ingredients: v.ingredients || "",
              key_features: v.key_features || "",
              packaging_standard: v.packaging_standard || "",
              is_popular: v.is_popular || false,
            };
          })
        ),
      ]);

      setStatusStep("Menyimpan produk...");

      const res = await fetchWithTimeout("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          price: price ? parseFloat(price) : null,
          category,
          weight,
          origin,
          stock: stock ? parseInt(stock) : 0,
          badge,
          description,
          ingredients,
          packaging_standard: packagingStandard,
          key_features: keyFeatures,
          is_popular: isPopular,
          image_url: finalImageUrl,
          variants: processedVariants,
        }),
      });

      const result = await res.json().catch(() => ({}));
      if (!res.ok || !result.success) {
        throw new Error(result.message || "Gagal menyimpan produk.");
      }

      setSuccessMsg("Produk berhasil ditambahkan!");
      setTimeout(() => router.push("/admin/produk"), 450);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
      setStatusStep("");
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8 bg-white min-h-screen text-[#2D241E] font-sans">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <Link
            href="/admin/produk"
            className="text-xs font-bold text-[#5c0f1c] hover:underline flex items-center gap-1.5 mb-1"
          >
            <FontAwesomeIcon icon={faArrowLeft} /> Kembali ke Manajemen Produk
          </Link>
          <h1 className="text-2xl font-serif font-black text-[#3b0912]">Tambah Produk Baru</h1>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2">
          <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600 text-base" />
          <span className="font-bold">{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSaveProduct} className="space-y-6">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">
            Nama Produk
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Bagiak Susu Super Banyuwangi"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 focus:outline-none focus:border-[#5c0f1c]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">
              Harga Dasar (Rp)
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Contoh: 25000"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 focus:outline-none focus:border-[#5c0f1c]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">
              Kategori
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 font-bold focus:outline-none focus:border-[#5c0f1c]"
            >
              <option value="Makanan">Makanan</option>
              <option value="Minuman">Minuman</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">
              Berat Produk
            </label>
            <input
              type="text"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Contoh: 250 gram"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 focus:outline-none focus:border-[#5c0f1c]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">
              Asal Produk
            </label>
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="Contoh: Banyuwangi"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 focus:outline-none focus:border-[#5c0f1c]"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-widest text-[#3b0912] mb-1.5">
            📦 Stok Utama Produk
          </label>
          <input
            type="number"
            min="0"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-full bg-amber-50/60 border border-amber-300 rounded-xl px-4 py-3 text-xs text-[#3b0912] font-extrabold focus:outline-none"
          />
        </div>

        <div className="space-y-4 bg-gray-50/70 p-4 rounded-2xl border border-gray-200">
          <h4 className="text-xs font-bold uppercase tracking-widest text-[#3b0912]">
            Informasi & Deskripsi Produk Utama
          </h4>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">
              Deskripsi Produk
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tuliskan keterangan lengkap produk..."
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">
              Keunggulan Utama (Enter per baris)
            </label>
            <textarea
              rows={3}
              value={keyFeatures}
              onChange={(e) => setKeyFeatures(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 font-mono focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">
                Komposisi
              </label>
              <textarea
                rows={2}
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">
                Standar Kemasan
              </label>
              <input
                type="text"
                value={packagingStandard}
                onChange={(e) => setPackagingStandard(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Varian Produk Lengkap */}
        <div className="border border-amber-900/10 bg-amber-50/30 p-4 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-widest text-[#3b0912] flex items-center gap-2">
              <FontAwesomeIcon icon={faLayerGroup} className="text-amber-600" />
              <span>Varian Produk & Keterangan Khusus</span>
            </label>
            <button
              type="button"
              onClick={handleAddVariant}
              className="bg-[#3b0912] hover:bg-[#5c0f1c] text-amber-200 text-[10px] font-bold px-3 py-2 rounded-xl uppercase tracking-wider flex items-center gap-1 cursor-pointer"
            >
              <FontAwesomeIcon icon={faPlus} /> Tambah Varian
            </button>
          </div>

          {variants.length === 0 ? (
            <p className="text-xs text-gray-400 italic">Belum ada varian ditambahkan.</p>
          ) : (
            <div className="space-y-4">
              {variants.map((variant, index) => (
                <div key={index} className="bg-white border border-gray-200 p-4 rounded-xl space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                      Varian #{index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(index)}
                      className="text-rose-600 hover:text-rose-800 text-xs font-bold cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faTrash} /> Hapus Varian
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Nama Varian (Cth: Rasa Keju)"
                      value={variant.name}
                      onChange={(e) => handleVariantChange(index, "name", e.target.value)}
                      className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none"
                    />
                    <input
                      type="number"
                      placeholder="Harga Varian (Rp)"
                      value={variant.price}
                      onChange={(e) => handleVariantChange(index, "price", e.target.value)}
                      className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none"
                    />
                    <input
                      type="number"
                      min="0"
                      placeholder="Stok Varian"
                      value={variant.stock}
                      onChange={(e) => handleVariantChange(index, "stock", e.target.value)}
                      className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-[#3b0912] font-bold focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Berat Varian (Cth: 250 gram)"
                      value={variant.weight}
                      onChange={(e) => handleVariantChange(index, "weight", e.target.value)}
                      className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Asal Varian (Cth: Banyuwangi)"
                      value={variant.origin}
                      onChange={(e) => handleVariantChange(index, "origin", e.target.value)}
                      className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <textarea
                      rows={2}
                      placeholder="Deskripsi khusus varian ini..."
                      value={variant.description || ""}
                      onChange={(e) => handleVariantChange(index, "description", e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none resize-y"
                    />
                    <textarea
                      rows={2}
                      placeholder="Komposisi khusus varian ini..."
                      value={variant.ingredients || ""}
                      onChange={(e) => handleVariantChange(index, "ingredients", e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none resize-y"
                    />
                  </div>

                  <div className="space-y-2">
                    <textarea
                      rows={2}
                      placeholder="Keunggulan varian ini..."
                      value={variant.key_features || ""}
                      onChange={(e) => handleVariantChange(index, "key_features", e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none resize-y"
                    />
                    <input
                      type="text"
                      placeholder="Standar kemasan khusus varian ini..."
                      value={variant.packaging_standard || ""}
                      onChange={(e) =>
                        handleVariantChange(index, "packaging_standard", e.target.value)
                      }
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                    <label className="cursor-pointer bg-gray-50 border border-dashed border-gray-300 hover:border-[#5c0f1c] px-3 py-2 rounded-lg text-xs text-gray-600 font-bold inline-flex items-center gap-2">
                      <FontAwesomeIcon icon={faImage} className="text-[#5c0f1c]" />
                      <span>
                        {variant.image_url ? "Ganti Gambar Varian" : "Upload Gambar Varian"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleVariantImageChange(index, e)}
                        className="hidden"
                      />
                    </label>
                    {variant.image_url && (
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                        <img
                          src={variant.image_url}
                          alt="Variant preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 p-3 bg-amber-50/50 border border-amber-900/10 rounded-xl">
          <input
            type="checkbox"
            id="isPopular"
            checked={isPopular}
            onChange={(e) => setIsPopular(e.target.checked)}
            className="w-4 h-4 text-[#3b0912] rounded cursor-pointer"
          />
          <label htmlFor="isPopular" className="text-xs font-bold text-[#3b0912] cursor-pointer">
            Jadikan Produk Utama Unggulan (Tampil di Halaman Utama)
          </label>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">
            Unggah Gambar Utama Produk
          </label>
          <div className="flex items-center gap-4">
            <label className="flex-1 cursor-pointer bg-gray-50 border border-dashed border-gray-300 rounded-xl p-4 text-center">
              <FontAwesomeIcon icon={faImage} className="text-[#5c0f1c] text-xl mb-1" />
              <span className="block text-xs text-gray-600 font-bold">Pilih file gambar utama</span>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="w-16 h-16 rounded-xl object-cover border" />
            )}
          </div>
        </div>

        <div className="pt-4 flex gap-3">
          <Link
            href="/admin/produk"
            className="flex-1 text-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3.5 rounded-xl text-xs uppercase tracking-widest"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-[#3b0912] hover:bg-[#5c0f1c] text-amber-200 font-bold py-3.5 rounded-xl text-xs uppercase tracking-widest shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <>
                <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                <span>{statusStep || "Menyimpan..."}</span>
              </>
            ) : (
              <span>Simpan Produk Baru</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}