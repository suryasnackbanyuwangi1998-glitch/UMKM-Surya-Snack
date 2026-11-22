// src/components/ProductDetailClient.tsx
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faLocationDot,
  faWeightHanging,
  faBoxOpen,
  faFire,
  faMagnifyingGlassPlus,
  faXmark,
  faShieldHeart,
  faTruck,
  faCartPlus,
  faBagShopping,
  faStore,
  faHeart,
  faLayerGroup,
  faCheck,
  faPlus,
  faMinus,
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { useCart } from '@/context/CartProvider';
import { useStoreContact } from '@/context/ContactProvider';
import { useLanguage } from '@/context/LanguageContext';

export interface ProductVariantItem {
  id?: string;
  name: string;
  name_en?: string | null;
  price: number;
  stock: number;
  image_url?: string | null;
  description?: string | null;
  description_en?: string | null;
  ingredients?: string | null;
  ingredients_en?: string | null;
  key_features?: string | string[] | null;
  key_features_en?: string | string[] | null;
  packaging_standard?: string | null;
  packaging_standard_en?: string | null;
}

export interface ProductDetailData {
  id: string;
  slug?: string;
  name: string;
  name_en?: string | null;
  badge?: string | null;
  badge_en?: string | null;
  category?: string | null;
  price: number | null;
  stock?: number | null;
  weight?: string | null;
  sales?: number | null;
  image_url?: string | null;
  images?: string[] | null;
  description?: string | null;
  description_en?: string | null;
  long_description?: string | null;
  long_description_en?: string | null;
  ingredients?: string | null;
  ingredients_en?: string | null;
  key_features?: string | string[] | null;
  key_features_en?: string | string[] | null;
  packaging_standard?: string | null;
  packaging_standard_en?: string | null;
  variants?: ProductVariantItem[] | null;
}

interface ProductDetailClientProps {
  product: ProductDetailData;
  relatedProducts?: ProductDetailData[];
}

const GLOBAL_TR_CACHE = new Map<string, string>();

// Pisahkan emoji di awal baris (seperti 💛 atau 📍) sebelum dikirim ke API translate
function extractLeadingEmoji(text: string): { prefix: string; coreText: string } {
  const match = text.match(/^([\p{Extended_Pictographic}\u2600-\u27BF\uFE0F\s]+)(.*)$/u);
  if (match && match[2].trim().length > 0) {
    return {
      prefix: match[1],
      coreText: match[2].trim(),
    };
  }
  return { prefix: '', coreText: text.trim() };
}

// Pecah daftar poin (Key Highlights & Ingredients) per baris dan bersihkan simbol bullet
function cleanListLines(rawInput: unknown): string[] {
  if (!rawInput) return [];
  const rawString = Array.isArray(rawInput)
    ? rawInput.join('\n')
    : String(rawInput);

  return rawString
    .split(/\r?\n/)
    .map((line) => line.replace(/^[-*•\u2022]\s*/, '').trim())
    .filter((line) => line.length > 0);
}

// Pecah teks deskripsi / kemasan panjang menjadi potongan per baris
function splitParagraphLines(rawInput: unknown): string[] {
  if (!rawInput) return [];
  return String(rawInput)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

export default function ProductDetailClient({
  product,
  relatedProducts = [],
}: ProductDetailClientProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { getWaLink } = useStoreContact();
  const { lang } = useLanguage();

  const [translatedDict, setTranslatedDict] = useState<Record<string, string>>({});
  const [isTranslating, setIsTranslating] = useState<boolean>(false);

  const validVariants = useMemo<ProductVariantItem[]>(
    () =>
      Array.isArray(product?.variants)
        ? product.variants.filter(
            (v): v is ProductVariantItem =>
              Boolean(v && typeof v.name === 'string' && v.name.trim() !== '')
          )
        : [],
    [product?.variants]
  );
  const hasVariants = validVariants.length > 0;

  // -1 = Produk Utama, >= 0 = Index Varian
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number>(-1);
  const activeVariant =
    hasVariants && selectedVariantIndex >= 0
      ? validVariants[selectedVariantIndex]
      : null;

  const currentPrice = activeVariant ? activeVariant.price : product.price;
  const currentStock = activeVariant ? activeVariant.stock : product.stock;

  const storageKey = `surya_snack_tr_${lang}_v6`;

  // Muat cache terjemahan dari sessionStorage setiap kali bahasa berubah
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = window.sessionStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved) as Record<string, string>;
        Object.entries(parsed).forEach(([k, v]) => {
          GLOBAL_TR_CACHE.set(`${lang}:${k}`, v);
        });
        setTranslatedDict(parsed);
      } else {
        setTranslatedDict({});
      }
    } catch {
      setTranslatedDict({});
    }
  }, [lang, storageKey]);

  // Kirim teks dalam batch kecil + pemisahan emoji agar semua paragraf diterjemahkan sempurna
  useEffect(() => {
    if (!product) return;

    let isCancelled = false;

    async function fetchBatchTranslations() {
      const uniqueQueue: Array<{
        originalKey: string;
        prefix: string;
        cleanText: string;
      }> = [];
      const addedSet = new Set<string>();

      const enqueueText = (rawText: unknown) => {
        if (!rawText) return;
        const full = String(rawText).trim();
        if (!full) return;
        const cacheKey = `${lang}:${full}`;
        if (!GLOBAL_TR_CACHE.has(cacheKey) && !addedSet.has(full)) {
          addedSet.add(full);
          const { prefix, coreText } = extractLeadingEmoji(full);
          uniqueQueue.push({
            originalKey: full,
            prefix,
            cleanText: coreText,
          });
        }
      };

      const enqueueParagraphs = (rawBlock: unknown) => {
        splitParagraphLines(rawBlock).forEach((line) => enqueueText(line));
      };

      const enqueueLines = (rawList: unknown) => {
        cleanListLines(rawList).forEach((line) => enqueueText(line));
      };

      const collectItemFields = (
        item:
          | Partial<
              Omit<ProductDetailData & ProductVariantItem, 'price' | 'stock'>
            >
          | null
          | undefined
      ) => {
        if (!item) return;

        if (lang === 'en') {
          if (!item.name_en) enqueueText(item.name);
          if (!item.badge_en) enqueueText(item.badge);

          const descEn = item.long_description_en || item.description_en;
          const descId = item.long_description || item.description;
          if (!descEn) enqueueParagraphs(descId);

          if (!item.key_features_en) enqueueLines(item.key_features);
          if (!item.ingredients_en) enqueueLines(item.ingredients);
          if (!item.packaging_standard_en)
            enqueueParagraphs(item.packaging_standard);
        } else {
          enqueueText(item.name);
          enqueueText(item.badge);
          enqueueParagraphs(item.long_description || item.description);
          enqueueLines(item.key_features);
          enqueueLines(item.ingredients);
          enqueueParagraphs(item.packaging_standard);
        }
      };

      // 1. Produk utama
      collectItemFields(product);

      // 2. Semua varian (jika ada)
      validVariants.forEach((variant) => collectItemFields(variant));

      // 3. Produk rekomendasi
      relatedProducts.forEach((rel) => {
        if (lang === 'en' && !rel.name_en) enqueueText(rel.name);
        if (lang === 'id') enqueueText(rel.name);
      });

      if (uniqueQueue.length === 0) return;

      setIsTranslating(true);

      const CHUNK_SIZE = 5;
      for (let i = 0; i < uniqueQueue.length; i += CHUNK_SIZE) {
        if (isCancelled) break;
        const chunk = uniqueQueue.slice(i, i + CHUNK_SIZE);
        const fieldsToSend: Record<string, string> = {};
        chunk.forEach((entry, idx) => {
          fieldsToSend[`f_${idx}`] = entry.cleanText;
        });

        try {
          const res = await fetch('/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fields: fieldsToSend,
              sourceLang: lang === 'en' ? 'id' : 'en',
              targetLang: lang === 'en' ? 'en' : 'id',
            }),
          });

          if (!res.ok) continue;
          const data = await res.json();
          const translatedMap: Record<string, string> = data?.translated || {};

          if (!isCancelled && data?.success) {
            const newEntries: Record<string, string> = {};
            chunk.forEach((entry, idx) => {
              const translatedCore = translatedMap[`f_${idx}`];
              if (translatedCore && translatedCore.trim() !== '') {
                const finalText = `${entry.prefix}${translatedCore.trim()}`;
                GLOBAL_TR_CACHE.set(`${lang}:${entry.originalKey}`, finalText);
                newEntries[entry.originalKey] = finalText;
              }
            });

            if (Object.keys(newEntries).length > 0) {
              setTranslatedDict((prev) => {
                const merged = { ...prev, ...newEntries };
                if (typeof window !== 'undefined') {
                  try {
                    window.sessionStorage.setItem(
                      storageKey,
                      JSON.stringify(merged)
                    );
                  } catch {
                    // Abaikan quota error
                  }
                }
                return merged;
              });
            }
          }
        } catch (err) {
          console.error('Gagal menerjemahkan konten produk:', err);
        }
      }

      if (!isCancelled) {
        setIsTranslating(false);
      }
    }

    fetchBatchTranslations();

    return () => {
      isCancelled = true;
    };
  }, [lang, product, validVariants, relatedProducts, storageKey]);

  // Helper resolusi teks tunggal (judul, nama produk, badge)
  const resolveText = (
    idVal: unknown,
    enVal: unknown,
    fallbackId = '',
    fallbackEn = ''
  ): string => {
    if (lang === 'en') {
      if (enVal && String(enVal).trim() !== '') return String(enVal).trim();
      if (idVal && String(idVal).trim() !== '') {
        const key = String(idVal).trim();
        return translatedDict[key] || GLOBAL_TR_CACHE.get(`en:${key}`) || key;
      }
      return fallbackEn;
    }

    if (idVal && String(idVal).trim() !== '') {
      const key = String(idVal).trim();
      return translatedDict[key] || GLOBAL_TR_CACHE.get(`id:${key}`) || key;
    }
    return fallbackId;
  };

  // Helper resolusi teks paragraf panjang (About This Product & Packaging Standard) per baris
  const resolveParagraphBlock = (
    idVal: unknown,
    enVal: unknown,
    fallbackId = '',
    fallbackEn = ''
  ): string => {
    if (lang === 'en') {
      if (enVal && String(enVal).trim() !== '') return String(enVal).trim();
      if (idVal && String(idVal).trim() !== '') {
        const lines = splitParagraphLines(idVal);
        if (lines.length > 0) {
          return lines
            .map(
              (line) =>
                translatedDict[line] || GLOBAL_TR_CACHE.get(`en:${line}`) || line
            )
            .join('\n\n');
        }
      }
      return fallbackEn;
    }

    if (idVal && String(idVal).trim() !== '') {
      const lines = splitParagraphLines(idVal);
      if (lines.length > 0) {
        return lines
          .map(
            (line) =>
              translatedDict[line] || GLOBAL_TR_CACHE.get(`id:${line}`) || line
          )
          .join('\n\n');
      }
    }
    return fallbackId;
  };

  // Helper resolusi list baris (Key Highlights & Ingredients)
  const resolveListLines = (
    idRaw: unknown,
    enRaw: unknown,
    fallbackIdList: string[],
    fallbackEnList: string[]
  ): string[] => {
    if (lang === 'en') {
      const enLines = cleanListLines(enRaw);
      if (enLines.length > 0) return enLines;

      const idLines = cleanListLines(idRaw);
      if (idLines.length > 0) {
        return idLines.map(
          (line) =>
            translatedDict[line] || GLOBAL_TR_CACHE.get(`en:${line}`) || line
        );
      }
      return fallbackEnList;
    }

    const idLines = cleanListLines(idRaw);
    if (idLines.length > 0) {
      return idLines.map(
        (line) =>
          translatedDict[line] || GLOBAL_TR_CACHE.get(`id:${line}`) || line
      );
    }
    return fallbackIdList;
  };

  const labels = {
    id: {
      back: 'Kembali ke Katalog',
      brandTag: '✦ UMKM Surya Snack Banyuwangi ✦',
      selectVariant: 'Pilih Menu / Varian:',
      mainProduct: 'Produk Utama',
      variantLabel: 'Varian:',
      weight: 'Berat:',
      stockAvailable: 'Tersedia',
      stockEmpty: 'Stok Habis',
      sold: 'Terjual:',
      origin: 'Asal: Banyuwangi',
      quantity: 'Jumlah Pesanan',
      estTotal: 'Total Estimasi:',
      addToCartBtn: 'TAMBAHKAN KE KERANJANG',
      waBtn: 'Tanya-Tanya Produk via WhatsApp',
      halalBadge: '100% Halal & Tanpa Pengawet',
      shippingBadge: 'Pengiriman Seluruh Nusantara',
      modalTag: 'Keranjang Belanja',
      modalSuccess: 'Berhasil Ditambahkan!',
      subtotal: 'Subtotal:',
      addMore: '+ Tambah Produk Lain',
      viewCart: 'Lihat Keranjang',
      tabDesc: 'Deskripsi & Keunggulan',
      tabComp: 'Komposisi & Kemasan',
      tabOrder: 'Alur Pemesanan',
      aboutTitle: 'Tentang Produk Ini',
      highlightsTitle: 'Keunggulan Utama',
      compTitle: 'Detail Komposisi & Standar Kemasan',
      compSub: 'Komposisi / Bahan Utama',
      pkgSub: 'Standar Kemasan',
      orderTitle: 'Alur Pemesanan Cepat & Transparan',
      relatedTitle: 'Jajanan Khas Lainnya',
      viewAll: 'Lihat Semua →',
      zoomText: 'Perbesar Gambar',
      noRelated: 'Belum ada produk lainnya.',
      alertQty: 'Silakan tentukan jumlah pesanan terlebih dahulu (minimal 1 pcs).',
      translatingNote: 'Menyesuaikan bahasa...',
    },
    en: {
      back: 'Back to Catalog',
      brandTag: '✦ Banyuwangi Surya Snack MSME ✦',
      selectVariant: 'Select Menu / Variant:',
      mainProduct: 'Main Product',
      variantLabel: 'Variant:',
      weight: 'Weight:',
      stockAvailable: 'Available',
      stockEmpty: 'Out of Stock',
      sold: 'Sold:',
      origin: 'Origin: Banyuwangi',
      quantity: 'Order Quantity',
      estTotal: 'Estimated Total:',
      addToCartBtn: 'ADD TO CART',
      waBtn: 'Ask About Product via WhatsApp',
      halalBadge: '100% Halal & Preservative-Free',
      shippingBadge: 'Nationwide Shipping',
      modalTag: 'Shopping Cart',
      modalSuccess: 'Successfully Added!',
      subtotal: 'Subtotal:',
      addMore: '+ Add Other Products',
      viewCart: 'View Cart',
      tabDesc: 'Description & Highlights',
      tabComp: 'Ingredients & Packaging',
      tabOrder: 'Ordering Process',
      aboutTitle: 'About This Product',
      highlightsTitle: 'Key Highlights',
      compTitle: 'Ingredients & Packaging Standards',
      compSub: 'Ingredients / Main Elements',
      pkgSub: 'Packaging Standard',
      orderTitle: 'Fast & Transparent Ordering Process',
      relatedTitle: 'Other Traditional Snacks',
      viewAll: 'View All →',
      zoomText: 'Zoom Image',
      noRelated: 'No other products available.',
      alertQty: 'Please specify the order quantity first (minimum 1 pcs).',
      translatingNote: 'Translating content...',
    },
  };

  const t = labels[lang as 'id' | 'en'] || labels.id;

  const getVariantDisplayName = (variant: ProductVariantItem): string =>
    resolveText(variant.name, variant.name_en, variant.name, variant.name);

  const activeProductName = resolveText(
    product.name,
    product.name_en,
    product.name,
    product.name
  );

  const activeBadge = resolveText(
    product.badge || 'Best Seller',
    product.badge_en,
    'Best Seller',
    'Best Seller'
  );

  const activeVariantDisplayName = activeVariant
    ? getVariantDisplayName(activeVariant)
    : '';

  const getTranslatedCategory = (cat?: string | null): string => {
    if (!cat) return '';
    const lower = cat.trim().toLowerCase();
    if (lang === 'en') {
      if (lower === 'makanan' || lower === 'food') return 'Food';
      if (lower === 'minuman' || lower === 'beverage' || lower === 'beverages')
        return 'Beverage';
    } else {
      if (lower === 'food') return 'Makanan';
      if (lower === 'beverage' || lower === 'beverages') return 'Minuman';
    }
    return cat;
  };

  // 1. ISI TAB DESCRIPTION & HIGHLIGHTS
  const activeDescription = activeVariant
    ? resolveParagraphBlock(
        activeVariant.description ||
          product.long_description ||
          product.description,
        activeVariant.description_en ||
          product.long_description_en ||
          product.description_en,
        'Belum ada deskripsi lengkap untuk produk ini.',
        'No detailed description available for this product.'
      )
    : resolveParagraphBlock(
        product.long_description || product.description,
        product.long_description_en || product.description_en,
        'Belum ada deskripsi lengkap untuk produk ini.',
        'No detailed description available for this product.'
      );

  const highlights = resolveListLines(
    (activeVariant && activeVariant.key_features) || product.key_features,
    (activeVariant && activeVariant.key_features_en) || product.key_features_en,
    [
      'Tanpa Bahan Pengawet Buatan.',
      'Resep Warisan Leluhur Khas Banyuwangi.',
      'Renyah, Gurih, dan Higienis.',
    ],
    [
      'No Artificial Preservatives.',
      'Authentic Ancestral Heritage Recipe of Banyuwangi.',
      'Crispy, Savory, and Hygienic.',
    ]
  );

  // 2. ISI TAB INGREDIENTS & PACKAGING
  const ingredientLines = resolveListLines(
    (activeVariant && activeVariant.ingredients) || product.ingredients,
    (activeVariant && activeVariant.ingredients_en) || product.ingredients_en,
    [
      'Menggunakan bahan-bahan alami pilihan berkualitas tinggi tanpa pengawet buatan.',
    ],
    [
      'Using selected natural ingredients of high quality without artificial preservatives.',
    ]
  );

  const activePackaging = activeVariant
    ? resolveParagraphBlock(
        activeVariant.packaging_standard || product.packaging_standard,
        activeVariant.packaging_standard_en || product.packaging_standard_en,
        'Dikemas menggunakan kemasan mika transparan / standing pouch kedap udara yang higienis.',
        'Packed using hygienic transparent mica box / airtight standing pouch packaging.'
      )
    : resolveParagraphBlock(
        product.packaging_standard,
        product.packaging_standard_en,
        'Dikemas menggunakan kemasan mika transparan / standing pouch kedap udara yang higienis.',
        'Packed using hygienic transparent mica box / airtight standing pouch packaging.'
      );

  // 3. ISI TAB ORDERING PROCESS
  const orderSteps: [string, string][] =
    lang === 'en'
      ? [
          [
            hasVariants
              ? '1. Select Variant & Quantity'
              : '1. Specify Order Quantity',
            hasVariants
              ? 'Choose your preferred variant and order quantity as needed, then click Add to Cart.'
              : 'Specify the order quantity as needed, then click Add to Cart.',
          ],
          [
            '2. Added to Cart',
            hasVariants
              ? 'The product along with its selected variant will automatically be saved safely in your shopping cart.'
              : 'Your selected product will automatically be saved safely in your shopping cart.',
          ],
          [
            '3. Review Order Summary',
            'Open the shopping cart menu to review your itemized order summary transparently.',
          ],
          [
            '4. Send Inquiry to WhatsApp',
            'Click the order button to send an automated order recap directly to the Surya Snack admin via WhatsApp.',
          ],
        ]
      : [
          [
            hasVariants
              ? '1. Tentukan Varian & Jumlah'
              : '1. Tentukan Jumlah Pesanan',
            hasVariants
              ? 'Pilih varian rasa serta jumlah pesanan sesuai kebutuhan lalu klik Tambahkan ke Keranjang.'
              : 'Tentukan jumlah pesanan sesuai kebutuhan lalu klik Tambahkan ke Keranjang.',
          ],
          [
            '2. Masuk Keranjang',
            hasVariants
              ? 'Produk beserta varian pilihannya akan otomatis tersimpan aman di keranjang belanja.'
              : 'Produk pilihan Anda akan otomatis tersimpan aman di keranjang belanja.',
          ],
          [
            '3. Periksa Rincian Pesanan',
            'Buka menu keranjang untuk melihat rincian daftar belanjaan Anda secara transparan.',
          ],
          [
            '4. Kirim ke WhatsApp',
            'Klik tombol pemesanan untuk mengirimkan rekap pesanan otomatis langsung ke WhatsApp admin.',
          ],
        ];

  const fallbackImage =
    'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?q=80&w=800';
  const mainProductImage =
    product.image_url && product.image_url.trim() !== ''
      ? product.image_url
      : fallbackImage;

  const variantImages = validVariants
    .map((v: ProductVariantItem) => v.image_url)
    .filter((img): img is string => Boolean(img && img.trim() !== ''));

  const images: string[] = Array.from(new Set([mainProductImage, ...variantImages]));

  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [hoveredImageUrl, setHoveredImageUrl] = useState<string | null>(null);

  const [zoomOpen, setZoomOpen] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'deskripsi' | 'komposisi' | 'pemesanan'>(
    'deskripsi'
  );

  const [quantity, setQuantity] = useState<number>(0);

  const formatRupiah = (price: number | null | undefined): string =>
    price === null || price === undefined
      ? lang === 'en'
        ? 'Contact for price'
        : 'Hubungi untuk harga'
      : `Rp ${price.toLocaleString('id-ID')}`;

  const handleDecrement = () => {
    if (quantity > 0) setQuantity((prev) => prev - 1);
  };

  const handleIncrement = () => setQuantity((prev) => prev + 1);

  const totalPrice = (currentPrice || 0) * quantity;

  const handleAddToCartAndOpenModal = () => {
    if (quantity <= 0) {
      alert(t.alertQty);
      return;
    }

    const activeVariantImage = activeVariant?.image_url;
    const productWithVariant = {
      ...product,
      name: activeVariant
        ? `${activeProductName} (${activeVariantDisplayName})`
        : activeProductName,
      price: currentPrice,
      stock: currentStock,
      image_url: activeVariantImage || product.image_url || fallbackImage,
      selectedVariant: activeVariant ? activeVariantDisplayName : undefined,
    };
    addToCart(productWithVariant as any, quantity);
    setShowModal(true);
  };

  const handleAskWhatsApp = () => {
    const variantInfo = activeVariant
      ? ` (${t.variantLabel} ${activeVariantDisplayName})`
      : '';
    const text =
      lang === 'en'
        ? `Hello Admin Surya Snack 👋, I would like to inquire about the product *${activeProductName}${variantInfo}* priced at *${formatRupiah(currentPrice)}*. Please provide info, thank you!`
        : `Halo Kak Admin Surya Snack 👋, saya ingin bertanya-tanya mengenai produk *${activeProductName}${variantInfo}* seharga *${formatRupiah(currentPrice)}*. Mohon informasinya ya, terima kasih!`;
    window.open(getWaLink(text), '_blank');
  };

  useEffect(() => {
    if (!zoomOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setZoomOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [zoomOpen]);

  const activeDisplayImage =
    hoveredImageUrl ||
    (activeVariant?.image_url && activeVariant.image_url.trim() !== ''
      ? activeVariant.image_url
      : null) ||
    images[selectedImage] ||
    mainProductImage;

  return (
    <div className="min-h-screen bg-white text-[#2B211B] font-sans selection:bg-[#5A0A14] selection:text-amber-100">
      <div className="mx-auto w-full max-w-6xl px-4 pb-24 pt-14 sm:px-6 sm:pt-20 lg:pb-20">
        {/* ===== TOMBOL KEMBALI & BREADCRUMB ===== */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <Link
            href="/katalog"
            className="inline-flex items-center gap-2 rounded-full border border-[#5A0A14]/20 bg-[#FAF7F0] px-4 py-2 text-xs font-bold text-[#5A0A14] shadow-2xs transition hover:bg-[#5A0A14] hover:text-amber-200"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="h-3 w-3" />
            <span>{t.back}</span>
          </Link>
          <span className="text-[11px] uppercase tracking-[0.22em] text-[#9A5D0A] font-extrabold hidden sm:block">
            {t.brandTag}
          </span>
        </div>

        {/* ===== KONTEN UTAMA ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start bg-[#FAF7F0] rounded-3xl border border-[#5A0A14]/15 p-5 sm:p-10 shadow-xs">
          {/* GALERI FOTO */}
          <div className="lg:col-span-6 space-y-4">
            <button
              type="button"
              onClick={() => setZoomOpen(true)}
              className="group relative block aspect-square w-full cursor-zoom-in overflow-hidden rounded-2xl border border-[#5A0A14]/12 bg-white shadow-2xs"
            >
              <Image
                src={activeDisplayImage}
                alt={activeProductName}
                fill
                unoptimized
                priority
                className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-[#5A0A14]/85 px-3.5 py-1.5 text-[11px] font-bold text-amber-200 backdrop-blur-md">
                <FontAwesomeIcon icon={faMagnifyingGlassPlus} className="h-3 w-3" />
                {t.zoomText}
              </span>
            </button>

            {images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {images.map((img, idx) => {
                  const isMainImage = idx === 0;
                  const isSelected = isMainImage
                    ? selectedVariantIndex === -1 && hoveredImageUrl === null
                    : selectedVariantIndex === idx - 1 && hoveredImageUrl === null;

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        if (isMainImage) {
                          setSelectedVariantIndex(-1);
                        } else {
                          setSelectedVariantIndex(idx - 1);
                        }
                        setSelectedImage(idx);
                        setHoveredImageUrl(null);
                      }}
                      className={`relative h-18 w-18 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-white transition cursor-pointer ${
                        isSelected
                          ? 'border-[#5A0A14] ring-2 ring-[#9A5D0A]/30'
                          : 'border-[#5A0A14]/15 opacity-65 hover:opacity-100'
                      }`}
                    >
                      <Image src={img} alt="" fill unoptimized className="object-cover" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* INFORMASI & AKSI UTAMA */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-[#5A0A14] text-amber-200 text-[11px] font-bold uppercase tracking-widest px-3.5 py-1 rounded-full shadow-2xs border border-amber-300/30">
                  {activeBadge}
                </span>
                {product.category && (
                  <span className="bg-[#EFE6D5] text-[#5A0A14] border border-[#5A0A14]/15 text-xs font-bold px-3 py-1 rounded-full">
                    {getTranslatedCategory(product.category)}
                  </span>
                )}
                {isTranslating && (
                  <span className="text-[10px] font-semibold text-[#9A5D0A] animate-pulse">
                    {t.translatingNote}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#5A0A14] leading-tight">
                {activeVariant
                  ? `${activeProductName} (${activeVariantDisplayName})`
                  : activeProductName}
              </h1>

              <div className="text-2xl sm:text-3xl font-black text-[#5A0A14] pt-2 font-serif bg-[#EFE6D5]/80 px-4 py-3 rounded-2xl border border-[#5A0A14]/15 flex items-center justify-between gap-2">
                <span>{formatRupiah(currentPrice)}</span>
                {hasVariants && (
                  <span className="text-xs font-sans font-bold text-[#5A0A14] bg-white px-3 py-1 rounded-full border border-[#5A0A14]/20">
                    {activeVariant
                      ? `${t.variantLabel} ${activeVariantDisplayName}`
                      : t.mainProduct}
                  </span>
                )}
              </div>
            </div>

            {/* PILIHAN MENU PRODUK UTAMA & VARIAN */}
            {hasVariants && (
              <div className="space-y-3 pt-3 border-t border-[#5A0A14]/12 font-sans">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold uppercase tracking-widest text-[#5A0A14] flex items-center gap-2">
                    <FontAwesomeIcon icon={faLayerGroup} className="text-[#9A5D0A]" />
                    <span>{t.selectVariant}</span>
                  </label>
                  <span className="text-xs font-bold text-[#5A0A14] bg-[#EFE6D5] px-2.5 py-0.5 rounded-full border border-[#5A0A14]/15">
                    {activeVariant ? activeVariantDisplayName : t.mainProduct}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {/* Tombol Produk Utama */}
                  <button
                    type="button"
                    onMouseEnter={() => setHoveredImageUrl(mainProductImage)}
                    onMouseLeave={() => setHoveredImageUrl(null)}
                    onClick={() => {
                      setSelectedVariantIndex(-1);
                      setSelectedImage(0);
                      setHoveredImageUrl(null);
                    }}
                    className={`relative px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2.5 border ${
                      selectedVariantIndex === -1
                        ? 'border-[#5A0A14] bg-[#5A0A14] text-amber-200 shadow-sm scale-[1.02]'
                        : 'border-[#5A0A14]/20 bg-white text-[#2B211B] hover:border-[#5A0A14]/50 hover:bg-[#EFE6D5]/50'
                    }`}
                  >
                    <div className="relative w-6 h-6 rounded-lg overflow-hidden shrink-0 border border-black/10 bg-white">
                      <img
                        src={mainProductImage}
                        alt={t.mainProduct}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span>{t.mainProduct}</span>
                      <span
                        className={`text-[11px] font-semibold ${
                          selectedVariantIndex === -1
                            ? 'text-amber-300/90'
                            : 'text-[#6b5a50]'
                        }`}
                      >
                        ({formatRupiah(product.price)})
                      </span>
                    </div>
                    {selectedVariantIndex === -1 && (
                      <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 bg-amber-400 text-[#5A0A14] rounded-full flex items-center justify-center text-[9px] font-black shadow-xs border border-white">
                        <FontAwesomeIcon icon={faCheck} />
                      </span>
                    )}
                  </button>

                  {/* Daftar Tombol Varian */}
                  {validVariants.map((variant: ProductVariantItem, idx: number) => {
                    const isSelected = selectedVariantIndex === idx;
                    const translatedName = getVariantDisplayName(variant);

                    return (
                      <button
                        key={variant.id || idx}
                        type="button"
                        onMouseEnter={() => {
                          if (variant.image_url) setHoveredImageUrl(variant.image_url);
                        }}
                        onMouseLeave={() => {
                          setHoveredImageUrl(null);
                        }}
                        onClick={() => {
                          setSelectedVariantIndex(idx);
                          setHoveredImageUrl(null);
                        }}
                        className={`relative px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2.5 border ${
                          isSelected
                            ? 'border-[#5A0A14] bg-[#5A0A14] text-amber-200 shadow-sm scale-[1.02]'
                            : 'border-[#5A0A14]/20 bg-white text-[#2B211B] hover:border-[#5A0A14]/50 hover:bg-[#EFE6D5]/50'
                        }`}
                      >
                        {variant.image_url && (
                          <div className="relative w-6 h-6 rounded-lg overflow-hidden shrink-0 border border-black/10 bg-white">
                            <img
                              src={variant.image_url}
                              alt={translatedName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        <div className="flex items-center gap-1.5">
                          <span>{translatedName}</span>
                          <span
                            className={`text-[11px] font-semibold ${
                              isSelected ? 'text-amber-300/90' : 'text-[#6b5a50]'
                            }`}
                          >
                            ({formatRupiah(variant.price)})
                          </span>
                        </div>

                        {isSelected && (
                          <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 bg-amber-400 text-[#5A0A14] rounded-full flex items-center justify-center text-[9px] font-black shadow-xs border border-white">
                            <FontAwesomeIcon icon={faCheck} />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SPESIFIKASI SINGKAT */}
            <div className="grid grid-cols-2 gap-3 py-3 border-y border-[#5A0A14]/12 text-xs font-semibold text-[#2B211B]">
              {product.weight && (
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faWeightHanging} className="text-[#5A0A14]" />
                  <span>
                    {t.weight} {product.weight}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faBoxOpen} className="text-[#5A0A14]" />
                <span>
                  {(currentStock ?? 0) > 0
                    ? `${currentStock} ${t.stockAvailable}`
                    : t.stockEmpty}
                </span>
              </div>
              {(product.sales ?? 0) > 0 && (
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faFire} className="text-[#9A5D0A]" />
                  <span>
                    {t.sold} {product.sales}+ pcs
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faLocationDot} className="text-[#5A0A14]" />
                <span>{t.origin}</span>
              </div>
            </div>

            {/* AKSI: KUANTITAS & TOMBOL */}
            <div className="space-y-4 pt-1">
              <div className="flex items-center justify-between bg-[#EFE6D5]/70 p-3.5 rounded-2xl border border-[#5A0A14]/15">
                <span className="text-xs font-bold text-[#5A0A14]">{t.quantity}</span>

                <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-full border border-[#5A0A14]/20 shadow-2xs">
                  <button
                    type="button"
                    onClick={handleDecrement}
                    disabled={quantity <= 0}
                    className="w-7 h-7 rounded-full bg-white hover:bg-[#EFE6D5] text-[#5A0A14] flex items-center justify-center font-bold disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faMinus} className="w-3 h-3" />
                  </button>

                  <span className="w-8 text-center text-sm font-black text-[#5A0A14]">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={handleIncrement}
                    className="w-7 h-7 rounded-full bg-[#5A0A14] hover:bg-[#46070F] text-amber-200 flex items-center justify-center font-bold transition cursor-pointer shadow-2xs"
                  >
                    <FontAwesomeIcon icon={faPlus} className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs px-1">
                  <span className="text-[#6b5a50] font-medium">{t.estTotal}</span>
                  <span className="font-black text-lg text-[#5A0A14] font-serif">
                    {formatRupiah(totalPrice)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCartAndOpenModal}
                  className="flex w-full items-center justify-center gap-2.5 rounded-full py-3.5 text-xs font-extrabold text-amber-200 bg-[#5A0A14] hover:bg-[#46070F] shadow-sm transition-all uppercase tracking-wider cursor-pointer active:scale-95"
                >
                  <FontAwesomeIcon icon={faCartPlus} className="h-4 w-4 text-amber-300" />
                  <span>{t.addToCartBtn}</span>
                </button>

                <button
                  type="button"
                  onClick={handleAskWhatsApp}
                  className="flex w-full items-center justify-center gap-2.5 rounded-full py-3.5 text-xs font-extrabold text-white bg-[#18C95A] hover:bg-[#15b550] shadow-xs transition-all uppercase tracking-wider cursor-pointer active:scale-95"
                >
                  <FontAwesomeIcon icon={faWhatsapp} className="h-4 w-4 text-base" />
                  <span>{t.waBtn}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1 text-[11px] text-[#5f524a]">
              <div className="flex items-center gap-2 bg-white p-3 rounded-2xl border border-[#5A0A14]/12">
                <FontAwesomeIcon icon={faShieldHeart} className="text-[#5A0A14] text-base" />
                <span>{t.halalBadge}</span>
              </div>
              <div className="flex items-center gap-2 bg-white p-3 rounded-2xl border border-[#5A0A14]/12">
                <FontAwesomeIcon icon={faTruck} className="text-[#5A0A14] text-base" />
                <span>{t.shippingBadge}</span>
              </div>
            </div>
          </div>
        </div>

        {/* POP-UP MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-[#2B1607]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-[#FAF7F0] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#5A0A14]/20 relative font-sans space-y-5">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#EFE6D5] hover:bg-[#5A0A14] text-[#5A0A14] hover:text-amber-200 flex items-center justify-center transition cursor-pointer"
              >
                <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
              </button>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A0A14] bg-[#EFE6D5] border border-[#5A0A14]/15 px-3 py-1 rounded-full">
                  {t.modalTag}
                </span>
                <h3 className="font-serif font-bold text-xl text-[#5A0A14] mt-2.5">
                  {t.modalSuccess}
                </h3>
              </div>

              <div className="flex items-center gap-3.5 bg-white p-3.5 rounded-2xl border border-[#5A0A14]/12">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#FAF7F0] border border-[#5A0A14]/12 shrink-0">
                  <Image
                    src={activeVariant?.image_url || images[0]}
                    alt={activeProductName}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-[#2B211B] text-sm truncate">
                    {activeProductName}{' '}
                    {activeVariant ? `(${activeVariantDisplayName})` : ''}
                  </h4>
                  <p className="text-xs text-[#5A0A14] font-bold mt-0.5">
                    {quantity} pcs x {formatRupiah(currentPrice)}
                  </p>
                  <p className="text-xs font-extrabold text-[#5f524a] mt-1">
                    {t.subtotal}{' '}
                    <span className="text-[#5A0A14]">{formatRupiah(totalPrice)}</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-full bg-[#EFE6D5] hover:bg-[#e5d9c3] text-[#5A0A14] font-bold py-3 px-3 rounded-full border border-[#5A0A14]/20 text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FontAwesomeIcon icon={faStore} />
                  <span>{t.addMore}</span>
                </button>

                <button
                  type="button"
                  onClick={() => router.push('/keranjang')}
                  className="w-full bg-[#5A0A14] hover:bg-[#46070F] text-amber-200 font-bold py-3 px-3 rounded-full shadow-sm text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FontAwesomeIcon icon={faBagShopping} />
                  <span>{t.viewCart}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SECTION TAB: DESCRIPTION & HIGHLIGHTS | INGREDIENTS & PACKAGING | ORDERING PROCESS */}
        <div className="mt-10 bg-[#FAF7F0] rounded-3xl border border-[#5A0A14]/15 p-5 sm:p-10 shadow-xs space-y-7">
          <div className="flex flex-wrap gap-2 border-b border-[#5A0A14]/12 pb-4">
            <button
              onClick={() => setActiveTab('deskripsi')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                activeTab === 'deskripsi'
                  ? 'bg-[#5A0A14] text-amber-200 shadow-xs'
                  : 'bg-[#EFE6D5] text-[#2B211B] hover:text-[#5A0A14]'
              }`}
            >
              {t.tabDesc}
            </button>
            <button
              onClick={() => setActiveTab('komposisi')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                activeTab === 'komposisi'
                  ? 'bg-[#5A0A14] text-amber-200 shadow-xs'
                  : 'bg-[#EFE6D5] text-[#2B211B] hover:text-[#5A0A14]'
              }`}
            >
              {t.tabComp}
            </button>
            <button
              onClick={() => setActiveTab('pemesanan')}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                activeTab === 'pemesanan'
                  ? 'bg-[#5A0A14] text-amber-200 shadow-xs'
                  : 'bg-[#EFE6D5] text-[#2B211B] hover:text-[#5A0A14]'
              }`}
            >
              {t.tabOrder}
            </button>
          </div>

          <div className="min-h-45">
            {/* TAB 1: DESCRIPTION & HIGHLIGHTS */}
            {activeTab === 'deskripsi' && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3 gap-2">
                    <h3 className="text-xl font-serif font-bold text-[#5A0A14]">
                      {t.aboutTitle}
                    </h3>
                    {hasVariants && (
                      <span className="text-[11px] font-bold text-[#5A0A14] bg-[#EFE6D5] px-3 py-1 rounded-full border border-[#5A0A14]/15">
                        {activeVariant
                          ? `${t.variantLabel} ${activeVariantDisplayName}`
                          : t.mainProduct}
                      </span>
                    )}
                  </div>
                  <div className="text-[#5f524a] text-sm sm:text-base leading-relaxed whitespace-pre-line">
                    {activeDescription}
                  </div>
                </div>

                <div className="pt-5 border-t border-[#5A0A14]/12 space-y-4">
                  <h4 className="text-lg sm:text-xl font-serif font-bold text-[#5A0A14]">
                    {t.highlightsTitle}
                  </h4>

                  <div className="space-y-3">
                    {highlights.map((item: string, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 text-sm sm:text-base text-[#2B211B]"
                      >
                        <FontAwesomeIcon
                          icon={faHeart}
                          className="text-[#9A5D0A] mt-1 shrink-0 text-sm"
                        />
                        <p className="leading-relaxed flex-1">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: INGREDIENTS & PACKAGING */}
            {activeTab === 'komposisi' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-3 gap-2">
                  <h3 className="text-xl font-serif font-bold text-[#5A0A14]">
                    {t.compTitle}
                  </h3>
                  {hasVariants && (
                    <span className="text-[11px] font-bold text-[#5A0A14] bg-[#EFE6D5] px-3 py-1 rounded-full border border-[#5A0A14]/15">
                      {activeVariant
                        ? `${t.variantLabel} ${activeVariantDisplayName}`
                        : t.mainProduct}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-[#5A0A14]/12 space-y-3">
                    <h4 className="text-lg font-serif font-bold text-[#5A0A14] mb-2">
                      {t.compSub}
                    </h4>

                    <div className="space-y-2.5">
                      {ingredientLines.map((item: string, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2.5 text-sm text-[#2B211B]"
                        >
                          <FontAwesomeIcon
                            icon={faHeart}
                            className="text-[#9A5D0A] mt-1 shrink-0 text-xs"
                          />
                          <p className="leading-relaxed flex-1">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-[#5A0A14]/12 space-y-3">
                    <h4 className="text-lg font-serif font-bold text-[#5A0A14] mb-2">
                      {t.pkgSub}
                    </h4>

                    <p className="text-sm text-[#2B211B] whitespace-pre-line leading-relaxed">
                      {activePackaging}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: ORDERING PROCESS */}
            {activeTab === 'pemesanan' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xl font-serif font-bold text-[#5A0A14]">
                    {t.orderTitle}
                  </h3>
                  {hasVariants && (
                    <span className="text-[11px] font-bold text-[#5A0A14] bg-[#EFE6D5] px-3 py-1 rounded-full border border-[#5A0A14]/15">
                      {activeVariant
                        ? `${t.variantLabel} ${activeVariantDisplayName}`
                        : t.mainProduct}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {orderSteps.map(([title, desc], idx) => (
                    <div
                      key={idx}
                      className="bg-white p-5 rounded-2xl border border-[#5A0A14]/12 space-y-1.5 hover:border-[#5A0A14]/30 transition"
                    >
                      <h4 className="font-bold text-sm text-[#5A0A14]">{title}</h4>
                      <p className="text-xs text-[#5f524a] leading-relaxed">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ===== PRODUK LAINNYA / REKOMENDASI ===== */}
        <div className="mt-12 space-y-6">
          <div className="flex items-center justify-between border-b border-[#5A0A14]/12 pb-4">
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#5A0A14]">
              {t.relatedTitle}
            </h3>
            <Link
              href="/katalog"
              className="text-xs font-bold text-[#5A0A14] hover:text-[#9A5D0A] uppercase tracking-wider transition"
            >
              {t.viewAll}
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-5">
            {relatedProducts && relatedProducts.length > 0 ? (
              relatedProducts.map((item: ProductDetailData) => {
                const relatedName = resolveText(
                  item.name,
                  item.name_en,
                  item.name,
                  item.name
                );
                return (
                  <Link
                    key={item.id}
                    href={`/katalog/${item.slug || item.id}`}
                    className="group bg-[#FAF7F0] rounded-2xl border border-[#5A0A14]/15 overflow-hidden hover:shadow-[0_14px_30px_-10px_rgba(90,10,20,0.18)] hover:border-[#5A0A14]/35 transition flex flex-col justify-between"
                  >
                    <div className="relative aspect-square w-full overflow-hidden bg-[#EFE6D5]">
                      <Image
                        src={
                          item.image_url ||
                          'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?q=80&w=800'
                        }
                        alt={relatedName}
                        fill
                        unoptimized
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-3.5 bg-white space-y-1">
                      <h4 className="font-semibold text-xs sm:text-sm text-[#2B211B] line-clamp-1 group-hover:text-[#5A0A14] transition">
                        {relatedName}
                      </h4>
                      <p className="text-xs sm:text-sm font-bold text-[#5A0A14]">
                        {formatRupiah(item.price)}
                      </p>
                    </div>
                  </Link>
                );
              })
            ) : (
              <p className="text-xs text-[#6b5a50] col-span-full">{t.noRelated}</p>
            )}
          </div>
        </div>
      </div>

      {/* LIGHTBOX */}
      {zoomOpen && (
        <div
          role="dialog"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#2B1607]/90 p-4 backdrop-blur-sm sm:p-8"
          onClick={() => setZoomOpen(false)}
        >
          <button
            type="button"
            onClick={() => setZoomOpen(false)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 hover:bg-white/25 text-amber-200 cursor-pointer transition"
          >
            <FontAwesomeIcon icon={faXmark} className="h-4 w-4" />
          </button>
          <div
            className="relative h-[75vh] w-full max-w-4xl"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <Image
              src={activeDisplayImage}
              alt={activeProductName}
              fill
              unoptimized
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}