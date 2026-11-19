// src/components/ProductDetailClient.tsx
'use client';

import React, { useEffect, useState } from 'react';
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
import type { Product } from '@/types';

interface ProductDetailClientProps {
  product: Product & {
    variants?: Array<{
      id: string;
      name: string;
      price: number;
      stock: number;
      image_url?: string | null;
      description?: string | null;
      ingredients?: string | null;
      key_features?: string | null;
      packaging_standard?: string | null;
    }>;
  };
  relatedProducts?: Array<Product>;
}

export default function ProductDetailClient({ product, relatedProducts = [] }: ProductDetailClientProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { getWaLink } = useStoreContact();
  const { lang } = useLanguage();

  const t = {
    id: {
      back: "Kembali ke Katalog",
      brandTag: "✦ UMKM Surya Snack Banyuwangi ✦",
      selectVariant: "Pilih Varian Rasa:",
      mainProduct: "Produk Utama",
      variantLabel: "Varian:",
      weight: "Berat:",
      stockAvailable: "Tersedia",
      stockEmpty: "Stok Habis",
      sold: "Terjual:",
      origin: "Asal: Banyuwangi",
      quantity: "Jumlah Pesanan",
      estTotal: "Total Estimasi:",
      addToCartBtn: "TAMBAHKAN KE KERANJANG",
      waBtn: "Tanya-Tanya Produk via WhatsApp",
      halalBadge: "100% Halal & Tanpa Pengawet",
      shippingBadge: "Pengiriman Seluruh Nusantara",
      modalTag: "Keranjang Belanja",
      modalSuccess: "Berhasil Ditambahkan! 🎉",
      subtotal: "Subtotal:",
      addMore: "+ Tambah Produk Lain",
      viewCart: "Lihat Keranjang",
      tabDesc: "Deskripsi & Keunggulan",
      tabComp: "Komposisi & Kemasan",
      tabOrder: "Alur Pemesanan",
      aboutTitle: "Tentang Produk Ini",
      highlightsTitle: "Keunggulan Utama:",
      compTitle: "Detail Komposisi & Standar Kemasan",
      compSub: "Komposisi / Bahan Utama",
      pkgSub: "Standar Kemasan",
      orderTitle: "Alur Pemesanan Cepat & Transparan",
      relatedTitle: "Jajanan Khas Lainnya 🍪",
      viewAll: "Lihat Semua →",
      zoomText: "Perbesar Gambar",
      noRelated: "Belum ada produk lainnya.",
      alertQty: "Silakan tentukan jumlah pesanan terlebih dahulu (minimal 1 pcs).",
    },
    en: {
      back: "Back to Catalog",
      brandTag: "✦ Banyuwangi Surya Snack MSME ✦",
      selectVariant: "Select Flavor Variant:",
      mainProduct: "Main Product",
      variantLabel: "Variant:",
      weight: "Weight:",
      stockAvailable: "Available",
      stockEmpty: "Out of Stock",
      sold: "Sold:",
      origin: "Origin: Banyuwangi",
      quantity: "Order Quantity",
      estTotal: "Estimated Total:",
      addToCartBtn: "ADD TO CART",
      waBtn: "Ask About Product via WhatsApp",
      halalBadge: "100% Halal & Preservative-Free",
      shippingBadge: "Nationwide Shipping",
      modalTag: "Shopping Cart",
      modalSuccess: "Successfully Added! 🎉",
      subtotal: "Subtotal:",
      addMore: "+ Add Other Products",
      viewCart: "View Cart",
      tabDesc: "Description & Highlights",
      tabComp: "Ingredients & Packaging",
      tabOrder: "Ordering Process",
      aboutTitle: "About This Product",
      highlightsTitle: "Key Highlights:",
      compTitle: "Ingredients & Packaging Standards",
      compSub: "Ingredients / Main Elements",
      pkgSub: "Packaging Standard",
      orderTitle: "Fast & Transparent Ordering Process",
      relatedTitle: "Other Traditional Snacks 🍪",
      viewAll: "View All →",
      zoomText: "Zoom Image",
      noRelated: "No other products available.",
      alertQty: "Please specify the order quantity first (minimum 1 pcs).",
    },
  }[lang];

  const validVariants = Array.isArray(product.variants)
    ? product.variants.filter((v: any) => v && v.name && v.name.trim() !== '')
    : [];
  const hasVariants = validVariants.length > 0;

  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number>(-1);
  const activeVariant = hasVariants && selectedVariantIndex >= 0 ? validVariants[selectedVariantIndex] : null;

  const currentPrice = activeVariant ? activeVariant.price : product.price;
  const currentStock = activeVariant ? activeVariant.stock : product.stock;

  // Penerjemah Varian Otomatis
  const getTranslatedVariantName = (name: string) => {
    if (lang === 'en') {
      const translations: Record<string, string> = {
        'Original': 'Original',
        'Pedas': 'Spicy',
        'Manis': 'Sweet',
        'Gurih': 'Savory',
        'Asin': 'Salty',
        'Balado': 'Balado (Chili Mix)',
        'Keju': 'Cheese',
        'Sapi Panggang': 'Roasted Beef',
        'Jagung Bakar': 'Roasted Corn',
      };
      return translations[name] || name;
    }
    return name;
  };

  const getTranslatedDescription = (desc: string | null | undefined) => {
    if (!desc) return lang === 'en' ? 'No detailed description available.' : 'Belum ada deskripsi lengkap.';
    if (lang === 'en') {
      return desc
        .replace(/ABON AYAM EFIRA — Gurih, Lezat, dan Nikmatnya Lauk Pendamping Khas Berkualitas!/gi, "ABON AYAM EFIRA — Savory, Delicious, and Enjoyable Quality Side Dish!")
        .replace(/Nikmati kelezatan Abon Ayam Efira yang terbuat dari daging ayam pilihan berkualitas tinggi langsung dari produsen lokal\./gi, "Enjoy the deliciousness of Efira Chicken Abon made from high-quality chicken meat directly from local producers.")
        .replace(/Diolah secara higienis dengan bumbu rempah tradisional pilihan, menghasilkan abon ayam bertekstur lembut, berserat pas, serta memiliki cita rasa gurih dan manis yang lezat di lidah\./gi, "Hygienically processed with selected traditional spices, resulting in chicken abon with a soft texture, perfect fibers, and a savory, sweet taste that melts in your mouth.")
        .replace(/Dikemas dalam kemasan stand up pouch transparan modern yang dilengkapi dengan klip praktis, sangat pas untuk dinikmati bersama nasi hangat, bubur, sebagaiisian roti, maupun sebagai oleh-oleh khas pilihan yang istimewa\./gi, "Packed in a modern transparent standing pouch equipped with a practical clip, perfect to enjoy with warm rice, porridge, as bread filling, or as a special souvenir.")
        .replace(/Sensasi kelezatan daging ayam pilihan berpadu bumbu rempah gurih yang lezat di setiap taburan/gi, "The sensation of delicious selected chicken meat combined with savory spices in every sprinkle")
        .replace(/Pilihan lauk praktis dan favorit yang cocok disukai oleh seluruh anggota keluarga dari anak-anak hingga dewasa/gi, "A practical and favorite side dish loved by all family members from children to adults")
        .replace(/Oleh-oleh wajib berkualitas tinggi yang praktis dan tahan lama untuk menemani setiap hidangan Anda/gi, "A high-quality, practical, and long-lasting souvenir to accompany every meal")
        .replace(/Diproduksi langsung dengan label Efira dan dikurasi eksklusif untuk menyajikan kenikmatan lauk pendamping terbaik\./gi, "Produced directly under the Efira label and curated exclusively to present the best side dish enjoyment.")
        .replace(/Sempurnakan waktu makan Anda dengan kelezatan Abon Ayam Efira!/gi, "Perfect your mealtime with the deliciousness of Efira Chicken Abon!");
    }
    return desc;
  };

  const getTranslatedHighlights = (features: string[]) => {
    if (lang === 'en') {
      return features.map((item) => {
        return item
          .replace(/Praktis & Siap Saji: Bisa langsung dinikmati kapan saja sebagai pendamping nasi hangat atau pelengkap berbagai menu makanan\./gi, "Practical & Ready to Serve: Can be enjoyed anytime as a companion to warm rice or complement to various dishes.")
          .replace(/Cita Rasa Gurih & Manis Pas: Perpaduan bumbu rempah yang meresap sempurna membuat rasanya sangat lezat di lidah tanpa bikin enek\./gi, "Perfect Savory & Sweet Taste: The blend of spices absorbed perfectly makes it delicious without being overwhelming.")
          .replace(/Kemasan Stand Up Pouch Transparan \(Zipper\): Dilengkapi fitur klip penutup rapat untuk menjaga kerenyahan dan kualitas abon agar tetap tahan lama setelah dibuka\./gi, "Transparent Stand Up Pouch Packaging (Zipper): Equipped with a tight sealing clip to maintain crunchiness and quality after opening.");
      });
    }
    return features;
  };

  const getTranslatedIngredients = (ing: string | null | undefined) => {
    if (!ing) return lang === 'en' ? 'Using selected natural ingredients without artificial preservatives.' : 'Menggunakan bahan-bahan alami pilihan berkualitas tinggi tanpa pengawet buatan.';
    if (lang === 'en') {
      return ing
        .replace(/Daging Ayam Pilihan:/gi, 'Selected Chicken Meat:')
        .replace(/Bumbu Rempah Tradisional:/gi, 'Traditional Spices:')
        .replace(/Proses Higienis:/gi, 'Hygienic Process:')
        .replace(/Menggunakan daging ayam segar berkualitas unggul yang menghasilkan serat abon lembut dan bergizi\./gi, 'Using high-quality fresh chicken meat that produces soft and nutritious fibers.')
        .replace(/Perpaduan bawang, gula, garam, dan rempah pilihan untuk menciptakan rasa gurih yang khas dan menggugah selera\./gi, 'A blend of garlic, sugar, salt, and selected spices to create a distinctive and appetizing savory taste.')
        .replace(/Diproses secara teliti dan matang sempurna untuk menghasilkan produk yang bersih, gurih, dan berkualitas tinggi\./gi, 'Processed meticulously and cooked perfectly to produce a clean, savory, and high-quality product.');
    }
    return ing;
  };

  const getTranslatedPackaging = (pkg: string | null | undefined) => {
    if (!pkg) return lang === 'en' ? 'Packed using exclusive transparent mica plastic / airtight standing pouch.' : 'Dikemas menggunakan mika plastik transparan eksklusif / standing pouch kedap udara.';
    if (lang === 'en') {
      return pkg
        .replace(/Menggunakan kemasan stand up pouch transparan berstandar food grade yang kedap udara dan dilengkapi fitur klip \(zipper\) rapat untuk menjaga kehigienisan produk, lengkap dengan label resmi Efira, nomor P-IRT, logo Halal Indonesia, serta pilihan berat bersih yang fleksibel\./gi, 'Using food-grade transparent stand-up pouch packaging that is airtight and equipped with a tight zipper clip to maintain product hygiene, complete with official Efira label, P-IRT number, Halal Indonesia logo, and flexible net weight options.');
    }
    return pkg;
  };

  const activeDescription = activeVariant?.description 
    ? getTranslatedDescription(activeVariant.description)
    : getTranslatedDescription(product.long_description || product.description);

  const activeIngredients = getTranslatedIngredients(activeVariant?.ingredients || product.ingredients);
  const activePackaging = getTranslatedPackaging(activeVariant?.packaging_standard || product.packaging_standard);

  const fallbackImage = 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?q=80&w=800';
  const mainProductImage = product.image_url && product.image_url.trim() !== '' ? product.image_url : fallbackImage;
  
  const variantImages = validVariants
    .map((v) => v.image_url)
    .filter((img): img is string => Boolean(img && img.trim() !== ''));

  const images: string[] = Array.from(new Set([mainProductImage, ...variantImages]));

  const [selectedImage, setSelectedImage] = useState(0);
  const [hoveredImageUrl, setHoveredImageUrl] = useState<string | null>(null);

  const [zoomOpen, setZoomOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'deskripsi' | 'komposisi' | 'pemesanan'>('deskripsi');
  
  const [quantity, setQuantity] = useState(0);

  const formatRupiah = (price: number | null | undefined): string =>
    price === null || price === undefined
      ? (lang === 'en' ? 'Contact for price' : 'Hubungi untuk harga')
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
      name: activeVariant ? `${product.name} (${getTranslatedVariantName(activeVariant.name)})` : product.name,
      price: currentPrice,
      stock: currentStock,
      image_url: activeVariantImage || product.image_url || fallbackImage,
      selectedVariant: activeVariant ? getTranslatedVariantName(activeVariant.name) : undefined,
    };
    addToCart(productWithVariant, quantity);
    setShowModal(true);
  };

  const handleAskWhatsApp = () => {
    const variantInfo = activeVariant ? ` (${t.variantLabel} ${getTranslatedVariantName(activeVariant.name)})` : '';
    const text = lang === 'en' 
      ? `Hello Admin Surya Snack 👋, I would like to inquire about the product *${product.name}${variantInfo}* priced at *${formatRupiah(currentPrice)}*. Please provide info, thank you!`
      : `Halo Kak Admin Surya Snack 👋, saya ingin bertanya-tanya mengenai produk *${product.name}${variantInfo}* seharga *${formatRupiah(currentPrice)}*. Mohon informasinya ya, terima kasih!`;
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

  const rawKeyFeatures = activeVariant?.key_features || product.key_features;
  let highlights: string[] = [];

  if (typeof rawKeyFeatures === 'string' && rawKeyFeatures.trim() !== '') {
    highlights = rawKeyFeatures
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  } else if (Array.isArray(rawKeyFeatures)) {
    highlights = rawKeyFeatures
      .flatMap((item) => String(item).split(/\r?\n/))
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  } else {
    highlights = lang === 'en' ? [
      'No Artificial Preservatives.',
      'Authentic Ancestral Heritage Recipe of Banyuwangi.',
      'Crispy, Savory, and Hygienic.',
    ] : [
      'Tanpa Bahan Pengawet Buatan.',
      'Resep Warisan Leluhur Khas Banyuwangi.',
      'Renyah, Gurih, dan Higienis.',
    ];
  }

  highlights = getTranslatedHighlights(highlights);

  const orderSteps: [string, string][] = lang === 'en' ? [
    ['1. Select Variant & Quantity', 'Choose the flavor variant and order quantity as needed, then click Add to Cart.'],
    ['2. Added to Cart', 'The product and its chosen variant will automatically be stored securely in your shopping cart.'],
    ['3. Review Order', 'Open the cart menu to view your detailed billing summary transparently.'],
    ['4. Send to WhatsApp', 'Click the order button to send an automated order recap to the WhatsApp admin.'],
  ] : [
    ['1. Tentukan Varian & Jumlah', 'Pilih varian rasa serta jumlah pesanan sesuai kebutuhan lalu klik Tambah ke Keranjang.'],
    ['2. Masuk Keranjang', 'Produk beserta varian pilihannya akan otomatis tersimpan aman di keranjang belanja.'],
    ['3. Periksa Pesanan', 'Buka menu keranjang untuk melihat rincian nota belanjaan Anda secara transparan.'],
    ['4. Kirim ke WhatsApp', 'Klik tombol pemesanan untuk mengirimkan rekap pesanan otomatis ke WhatsApp admin.'],
  ];

  const activeDisplayImage = 
    hoveredImageUrl || 
    (activeVariant?.image_url && activeVariant.image_url.trim() !== '' ? activeVariant.image_url : null) || 
    images[selectedImage] || 
    mainProductImage;

  return (
    <div className="relative mx-auto w-full max-w-6xl px-4 pb-28 pt-20 sm:px-6 lg:pb-16 font-sans text-[#2D241E]">
      
      {/* ===== TOMBOL KEMBALI & BREADCRUMB ===== */}
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/katalog"
          className="inline-flex items-center gap-2 rounded-xl border border-amber-900/15 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 shadow-xs transition hover:border-[#5c0f1c]/40 hover:text-[#5c0f1c]"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="h-3.5 w-3.5" />
          <span>{t.back}</span>
        </Link>
        <span className="text-xs uppercase tracking-widest text-gray-400 font-bold hidden sm:block">
          {t.brandTag}
        </span>
      </div>

      {/* ===== KONTEN UTAMA ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start bg-white rounded-3xl border border-amber-900/10 p-6 sm:p-10 shadow-sm">
        
        {/* GALERI FOTO */}
        <div className="lg:col-span-6 space-y-4">
          <button
            type="button"
            onClick={() => setZoomOpen(true)}
            className="group relative block aspect-square w-full cursor-zoom-in overflow-hidden rounded-2xl border border-amber-900/10 bg-[#FAF7F0] shadow-inner"
          >
            <Image
              src={activeDisplayImage}
              alt={product.name}
              fill
              unoptimized
              priority
              className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
            />
            <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur-md">
              <FontAwesomeIcon icon={faMagnifyingGlassPlus} className="h-3 w-3" />
              {t.zoomText}
            </span>
          </button>

          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
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
                    className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition cursor-pointer ${
                      isSelected
                        ? 'border-[#5c0f1c] ring-2 ring-amber-400/40'
                        : 'border-gray-200 opacity-60 hover:opacity-100'
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
          
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#5c0f1c] text-amber-200 text-xs font-bold uppercase tracking-widest px-3.5 py-1 rounded-full font-serif shadow-xs">
                {product.badge || 'Best Seller'}
              </span>
              {product.category && (
                <span className="bg-amber-100/70 text-[#3b0912] text-xs font-bold px-3 py-1 rounded-full">
                  {product.category}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#3b0912] leading-tight">
              {activeVariant ? `${product.name} (${getTranslatedVariantName(activeVariant.name)})` : product.name}
            </h1>

            <div className="text-3xl font-black text-[#5c0f1c] pt-2 font-serif bg-amber-50/50 px-4 py-2.5 rounded-2xl border border-amber-200/50 flex items-center justify-between">
              <span>{formatRupiah(currentPrice)}</span>
              {activeVariant && (
                <span className="text-xs font-bold text-amber-800 bg-amber-200/60 px-2.5 py-1 rounded-lg">
                  {t.variantLabel} {getTranslatedVariantName(activeVariant.name)}
                </span>
              )}
            </div>
          </div>

          {/* PILIHAN VARIAN PRODUK */}
          {hasVariants && (
            <div className="space-y-3.5 pt-3 border-t border-amber-900/10 font-sans">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold uppercase tracking-widest text-[#3b0912] flex items-center gap-2">
                  <FontAwesomeIcon icon={faLayerGroup} className="text-amber-600" />
                  <span>{t.selectVariant}</span>
                </label>
                <span className="text-xs font-bold text-[#5c0f1c] bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200">
                  {activeVariant ? getTranslatedVariantName(activeVariant.name) : t.mainProduct}
                </span>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {validVariants.map((variant, idx) => {
                  const isSelected = selectedVariantIndex === idx;

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
                      className={`relative px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-3 border-2 ${
                        isSelected
                          ? 'border-[#5c0f1c] bg-[#3b0912] text-amber-100 shadow-md scale-[1.02]'
                          : 'border-gray-200 bg-[#FAF7F0] text-gray-800 hover:border-amber-900/40 hover:bg-white'
                      }`}
                    >
                      {variant.image_url && (
                        <div className="relative w-6 h-6 rounded-lg overflow-hidden shrink-0 border border-black/10 bg-white">
                          <img src={variant.image_url} alt={variant.name} className="w-full h-full object-cover" />
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <span>{getTranslatedVariantName(variant.name)}</span>
                        <span className={`text-[11px] font-semibold ${isSelected ? 'text-amber-200' : 'text-gray-500'}`}>
                          ({formatRupiah(variant.price)})
                        </span>
                      </div>

                      {isSelected && (
                        <span className="absolute -top-2 -right-2 w-5 h-5 bg-amber-400 text-[#3b0912] rounded-full flex items-center justify-center text-[10px] font-black shadow-sm border border-white">
                          <FontAwesomeIcon icon={faCheck} />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 py-3 border-y border-amber-900/10 text-xs font-semibold text-gray-700">
            {product.weight && (
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faWeightHanging} className="text-[#5c0f1c]" />
                <span>{t.weight} {product.weight}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faBoxOpen} className="text-[#5c0f1c]" />
              <span>{(currentStock ?? 0) > 0 ? `${currentStock} ${t.stockAvailable}` : t.stockEmpty}</span>
            </div>
            {(product.sales ?? 0) > 0 && (
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faFire} className="text-[#5c0f1c]" />
                <span>{t.sold} {product.sales}+ pcs</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faLocationDot} className="text-[#5c0f1c]" />
              <span>{t.origin}</span>
            </div>
          </div>

          {/* AKSI: KUANTITAS & TOMBOL */}
          <div className="space-y-4 pt-2">
            
            <div className="flex items-center justify-between bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200/70">
              <span className="text-xs font-bold text-[#3b0912]">{t.quantity}</span>

              <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border border-amber-300 shadow-2xs">
                <button
                  type="button"
                  onClick={handleDecrement}
                  disabled={quantity <= 0}
                  className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-amber-100 text-gray-800 flex items-center justify-center font-bold disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  <FontAwesomeIcon icon={faMinus} className="w-3 h-3" />
                </button>

                <span className="w-8 text-center text-sm font-black text-[#3b0912]">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={handleIncrement}
                  className="w-7 h-7 rounded-lg bg-amber-400 hover:bg-amber-300 text-[#3b0912] flex items-center justify-center font-bold transition cursor-pointer shadow-2xs"
                >
                  <FontAwesomeIcon icon={faPlus} className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs px-1">
                <span className="text-gray-500 font-medium">{t.estTotal}</span>
                <span className="font-black text-lg text-[#5c0f1c] font-serif">
                  {formatRupiah(totalPrice)}
                </span>
              </div>

              <button
                type="button"
                onClick={handleAddToCartAndOpenModal}
                className="flex w-full items-center justify-center gap-2.5 rounded-2xl py-3.5 text-xs font-extrabold text-white bg-[#5c0f1c] hover:bg-[#3b0912] shadow-md transition-all uppercase tracking-wider cursor-pointer active:scale-95"
              >
                <FontAwesomeIcon icon={faCartPlus} className="h-4 w-4 text-amber-300" />
                <span>{t.addToCartBtn}</span>
              </button>

              <button
                type="button"
                onClick={handleAskWhatsApp}
                className="flex w-full items-center justify-center gap-2.5 rounded-2xl py-3.5 text-xs font-extrabold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 shadow-xs transition-all uppercase tracking-wider cursor-pointer active:scale-95"
              >
                <FontAwesomeIcon icon={faWhatsapp} className="h-4 w-4 text-emerald-700 text-base" />
                <span>{t.waBtn}</span>
              </button>
            </div>

          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 text-[11px] text-gray-500">
            <div className="flex items-center gap-2 bg-[#FAF7F0] p-3 rounded-xl border border-amber-900/5">
              <FontAwesomeIcon icon={faShieldHeart} className="text-[#5c0f1c] text-base" />
              <span>{t.halalBadge}</span>
            </div>
            <div className="flex items-center gap-2 bg-[#FAF7F0] p-3 rounded-xl border border-amber-900/5">
              <FontAwesomeIcon icon={faTruck} className="text-[#5c0f1c] text-base" />
              <span>{t.shippingBadge}</span>
            </div>
          </div>

        </div>
      </div>

      {/* POP-UP MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-amber-100 relative font-sans space-y-5">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition cursor-pointer"
            >
              <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-1 rounded-md">
                {t.modalTag}
              </span>
              <h3 className="font-serif font-bold text-lg text-[#3b0912] mt-2">
                {t.modalSuccess}
              </h3>
            </div>

            <div className="flex items-center gap-3.5 bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white border border-gray-200 shrink-0">
                <Image
                  src={activeVariant?.image_url || images[0]}
                  alt={product.name}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-900 text-sm truncate">
                  {product.name} {activeVariant ? `(${getTranslatedVariantName(activeVariant.name)})` : ''}
                </h4>
                <p className="text-xs text-[#5c0f1c] font-bold mt-0.5">
                  {quantity} pcs x {formatRupiah(currentPrice)}
                </p>
                <p className="text-xs font-extrabold text-gray-700 mt-1">
                  {t.subtotal} <span className="text-[#5c0f1c]">{formatRupiah(totalPrice)}</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-full bg-amber-50 hover:bg-amber-100 text-[#5c0f1c] font-bold py-3 px-3 rounded-xl border border-amber-200 text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <FontAwesomeIcon icon={faStore} />
                <span>{t.addMore}</span>
              </button>

              <button
                type="button"
                onClick={() => router.push('/keranjang')}
                className="w-full bg-[#3b0912] hover:bg-[#5c0f1c] text-amber-200 font-bold py-3 px-3 rounded-xl shadow-md text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <FontAwesomeIcon icon={faBagShopping} />
                <span>{t.viewCart}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION TAB DESKRIPSI & KOMPOSISI */}
      <div className="mt-12 bg-white rounded-3xl border border-amber-900/10 p-6 sm:p-10 shadow-sm space-y-8">
        <div className="flex flex-wrap gap-2 border-b border-amber-900/10 pb-4">
          <button
            onClick={() => setActiveTab('deskripsi')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
              activeTab === 'deskripsi'
                ? 'bg-[#3b0912] text-amber-200 shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t.tabDesc}
          </button>
          <button
            onClick={() => setActiveTab('komposisi')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
              activeTab === 'komposisi'
                ? 'bg-[#3b0912] text-amber-200 shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t.tabComp}
          </button>
          <button
            onClick={() => setActiveTab('pemesanan')}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
              activeTab === 'pemesanan'
                ? 'bg-[#3b0912] text-amber-200 shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t.tabOrder}
          </button>
        </div>

        <div className="min-h-45">
          {activeTab === 'deskripsi' && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-serif font-bold text-[#3b0912]">{t.aboutTitle}</h3>
                  {activeVariant && (
                    <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                      {t.variantLabel} {getTranslatedVariantName(activeVariant.name)}
                    </span>
                  )}
                </div>
                <div className="text-gray-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {activeDescription}
                </div>
              </div>

              <div className="pt-4 border-t border-amber-900/10 space-y-4">
                <h4 className="text-xl font-serif font-bold text-[#3b0912]">
                  {t.highlightsTitle}
                </h4>
                
                <div className="space-y-3 font-serif">
                  {highlights.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-sm sm:text-base text-gray-700">
                      <FontAwesomeIcon icon={faHeart} className="text-amber-500 mt-1 shrink-0 text-sm" />
                      <p className="leading-relaxed flex-1">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'komposisi' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-serif font-bold text-[#3b0912]">{t.compTitle}</h3>
                {activeVariant && (
                  <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                    {t.variantLabel} {getTranslatedVariantName(activeVariant.name)}
                  </span>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#FAF7F0] p-4 rounded-2xl border border-amber-900/10 space-y-3">
                  <h4 className="text-xl font-serif font-bold text-[#3b0912] mb-2">
                    {t.compSub}
                  </h4>
                  
                  <div className="space-y-2.5 font-serif">
                    {String(activeIngredients || '')
                      .split(/\r?\n/)
                      .map((item) => item.replace(/^[-*•]\s*/, '').trim())
                      .filter((item) => item.length > 0)
                      .map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-sm text-gray-700">
                          <FontAwesomeIcon icon={faHeart} className="text-amber-500 mt-1 shrink-0 text-xs" />
                          <p className="leading-relaxed flex-1">{item}</p>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="bg-[#FAF7F0] p-4 rounded-2xl border border-amber-900/10 space-y-3">
                  <h4 className="text-xl font-serif font-bold text-[#3b0912] mb-2">
                    {t.pkgSub}
                  </h4>
                  
                  <div className="space-y-2.5 font-serif">
                    <p className="text-sm text-gray-700 font-medium whitespace-pre-line leading-relaxed">
                      {activePackaging}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pemesanan' && (
            <div className="space-y-6">
              <h3 className="text-xl font-serif font-bold text-[#3b0912]">{t.orderTitle}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {orderSteps.map(([title, desc], idx) => (
                  <div key={idx} className="bg-[#FAF7F0] p-4 rounded-2xl border border-amber-900/10 space-y-1.5 hover:border-amber-900/20 transition">
                    <h4 className="font-bold text-sm text-[#3b0912]">{title}</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===== PRODUK LAINNYA / REKOMENDASI ===== */}
      <div className="mt-12 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#3b0912]">
            {t.relatedTitle}
          </h3>
          <Link
            href="/katalog"
            className="text-xs font-bold text-[#5c0f1c] hover:underline uppercase tracking-wider"
          >
            {t.viewAll}
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {relatedProducts && relatedProducts.length > 0 ? (
            relatedProducts.map((item: any) => (
              <Link
                key={item.id}
                href={`/katalog/${item.slug || item.id}`}
                className="group bg-white rounded-2xl border border-amber-900/10 p-3 shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[#FAF7F0] mb-3">
                  <Image
                    src={item.image_url || 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?q=80&w=800'}
                    alt={item.name}
                    fill
                    unoptimized
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-xs sm:text-sm text-gray-900 line-clamp-1 group-hover:text-[#5c0f1c] transition">
                    {item.name}
                  </h4>
                  <p className="text-xs font-black text-[#5c0f1c] font-serif">
                    {formatRupiah(item.price)}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-xs text-gray-400 col-span-full">{t.noRelated}</p>
          )}
        </div>
      </div>

      {/* LIGHTBOX */}
      {zoomOpen && (
        <div
          role="dialog"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm sm:p-8"
          onClick={() => setZoomOpen(false)}
        >
          <button
            type="button"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white cursor-pointer"
          >
            <FontAwesomeIcon icon={faXmark} className="h-4 w-4" />
          </button>
          <div className="relative h-[75vh] w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <Image
              src={activeDisplayImage}
              alt={product.name}
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