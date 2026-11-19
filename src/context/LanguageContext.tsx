// src/context/LanguageContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "id" | "en";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  id: {
    // Navbar
    navHome: "Beranda",
    navProducts: "Produk",
    navAbout: "Tentang",
    navContact: "Kontak",
    
    // Beranda (Home)
    estLabel: "Oleh - Oleh Khas Banyuwangi",
    heroTitle: "Cita Rasa Legendaris Khas Banyuwangi",
    heroDesc: "Mengangkat kelezatan resep pusaka leluhur tanah Blambangan, disajikan khusus dalam balutan kualitas artisan yang renyah dan penuh kenangan.",
    exploreCatalog: "Jelajahi Katalog",
    contactStore: "Hubungi Toko",
    quoteText: "Kualitas sejati tidak pernah berkompromi pada rasa. Setiap gigitan adalah cerita tentang tradisi dan ketulusan.",
    quoteAuthor: "— SURYA SNACK ARTISAN KITCHEN",
    featuredBadge: "✦ Koleksi Pilihan ✦",
    featuredTitle: "Produk Unggulan Kami",
    featuredDesc: "Camilan terlaris yang selalu dirindukan para penikmat kuliner tradisional. (Geser ke samping untuk melihat lainnya)",
    viewAllProducts: "Lihat Seluruh Katalog Produk →",
    heritageSubtitle: "✦ Sejarah & Dedikasi ✦",
    heritageTitle: "Menjaga Tradisi, Memahat Cita Rasa",
    heritageDesc: "Berawal dari dapur rumahan di Banyuwangi, Surya Snack tumbuh dengan memegang teguh prinsip keaslian resep leluhur.",
    readyTitle: "Siap Menikmati Kelezatan Khas Banyuwangi?",
    waAdmin: "WhatsApp Admin & Tanya-tanya",

    // Komitmen Kualitas (4 Pilar)
    featureTag: "✦ Standar Artisan ✦",
    featureTitle: "Komitmen Kualitas Kami",
    feat1Title: "Resep Warisan Autentik",
    feat1Desc: "Diwariskan dari generasi ke generasi sejak tahun 1998, menjaga keaslian rasa tradisional Banyuwangi.",
    feat2Title: "Bahan Pilihan Premium",
    feat2Desc: "Hanya menggunakan hasil bumi pilihan tanpa pengawet buatan, diolah secara higienis setiap hari.",
    feat3Title: "Dipanggang & Digoreng Sempurna",
    feat3Desc: "Tekstur renyah di luar, empuk dan gurih di dalam dengan standar kualitas artisan.",
    feat4Title: "Layanan Pelanggan Personal",
    feat4Desc: "Pemesanan transparan dan konfirmasi langsung dengan respon hangat melalui WhatsApp.",

    // Halaman Produk / Katalog
    catalogTitle: "Katalog Produk Kami",
    catalogSubtitle: "✦ Koleksi Istimewa ✦",
    catalogDesc: "Pilihan camilan dan oleh-oleh khas Banyuwangi terbaik yang diolah secara higienis dengan resep turun-temurun.",
    searchPlaceholder: "Cari produk lezat...",
    allCategories: "Semua Produk",
    foodCategory: "Makanan",
    drinkCategory: "Minuman",
    emptyProduct: "Belum ada produk ditemukan.",
    addToCart: "+ Keranjang",
    detailProduct: "Detail",

    // Halaman Tentang (About)
    aboutTitle: "Tentang Surya Snack",
    aboutSubtitle: "✦ Perjalanan & Dedikasi ✦",
    aboutDesc1: "Berawal dari kecintaan terhadap kuliner tradisional Banyuwangi, Surya Snack hadir untuk melestarikan cita rasa resep leluhur dengan standar kebersihan dan kualitas modern.",
    aboutDesc2: "Setiap produk kami dibuat menggunakan bahan-bahan pilihan tanpa pengawet buatan, memberikan rasa renyah, gurih, dan autentik di setiap gigitannya.",

    // Halaman Kontak (Contact)
    contactPageTitle: "Hubungi Kami",
    contactPageSubtitle: "✦ Layanan & Pemesanan ✦",
    contactPageDesc: "Punya pertanyaan seputar produk atau ingin memesan dalam jumlah besar? Jangan ragu untuk menghubungi tim kami.",
    operationalHours: "Jam Operasional",
    hoursDetail: "Senin - Minggu: 08.00 - 21.00 WIB",
    location: "Lokasi",
    locationDetail: "Banyuwangi, Jawa Timur, Indonesia",

    // Footer
    footerDesc: "Menghadirkan kelezatan jajanan tradisional Banyuwangi dengan kualitas terbaik sejak bertahun-tahun.",
    footerNav: "NAVIGASI",
    footerInfo: "INFORMASI",
    footerSocial: "IKUTI KAMI",
    terms: "Syarat & Ketentuan",
    privacy: "Kebijakan Privasi",
    rights: "© 2026 Surya Snack. Authentic Indonesian Heritage.",
  },
  en: {
    // Navbar
    navHome: "Home",
    navProducts: "Products",
    navAbout: "About",
    navContact: "Contact",
    
    // Home
    estLabel: "Authentic Banyuwangi Souvenirs",
    heroTitle: "Legendary Authentic Taste of Banyuwangi",
    heroDesc: "Elevating the delicious heritage recipes of Blambangan, specially served in an artisan quality that is crispy and full of memories.",
    exploreCatalog: "Explore Catalog",
    contactStore: "Contact Store",
    quoteText: "True quality never compromises on taste. Every bite is a story of tradition and sincerity.",
    quoteAuthor: "— SURYA SNACK ARTISAN KITCHEN",
    featuredBadge: "✦ Featured Collection ✦",
    featuredTitle: "Our Featured Products",
    featuredDesc: "Best-selling snacks always sought after by traditional culinary lovers. (Swipe sideways to view more)",
    viewAllProducts: "View All Products Catalog →",
    heritageSubtitle: "✦ History & Dedication ✦",
    heritageTitle: "Preserving Tradition, Sculpting Flavor",
    heritageDesc: "Starting from a home kitchen in Banyuwangi, Surya Snack grew by strictly holding onto the principle of ancestral recipe authenticity.",
    readyTitle: "Ready to Enjoy Authentic Banyuwangi Delicacies?",
    waAdmin: "WhatsApp Admin & Inquiries",

    // Quality Commitment (4 Pillars)
    featureTag: "✦ Artisan Standards ✦",
    featureTitle: "Our Quality Commitment",
    feat1Title: "Authentic Heritage Recipe",
    feat1Desc: "Passed down from generation to generation since 1998, preserving the authentic taste of Banyuwangi traditions.",
    feat2Title: "Premium Selected Ingredients",
    feat2Desc: "Using only selected local produce without artificial preservatives, hygienically processed every day.",
    feat3Title: "Perfectly Baked & Fried",
    feat3Desc: "Crispy on the outside, tender and savory on the inside with artisan quality standards.",
    feat4Title: "Personal Customer Service",
    feat4Desc: "Transparent ordering and direct confirmation with warm response via WhatsApp.",

    // Products / Catalog Page
    catalogTitle: "Our Product Catalog",
    catalogSubtitle: "✦ Special Collection ✦",
    catalogDesc: "A selection of the best Banyuwangi snacks and souvenirs hygienically processed with traditional recipes.",
    searchPlaceholder: "Search delicious products...",
    allCategories: "All Products",
    foodCategory: "Food",
    drinkCategory: "Beverages",
    emptyProduct: "No products found.",
    addToCart: "+ Cart",
    detailProduct: "Details",

    // About Page
    aboutTitle: "About Surya Snack",
    aboutSubtitle: "✦ Journey & Dedication ✦",
    aboutDesc1: "Originating from a passion for traditional Banyuwangi culinary arts, Surya Snack was established to preserve ancestral recipe flavors with modern hygiene and quality standards.",
    aboutDesc2: "Each of our products is crafted using selected ingredients without artificial preservatives, delivering a crispy, savory, and authentic taste in every bite.",

    // Contact Page
    contactPageTitle: "Contact Us",
    contactPageSubtitle: "✦ Service & Orders ✦",
    contactPageDesc: "Have questions about our products or want to place a bulk order? Feel free to reach out to our team.",
    operationalHours: "Operational Hours",
    hoursDetail: "Monday - Sunday: 08:00 AM - 09:00 PM",
    location: "Location",
    locationDetail: "Banyuwangi, East Java, Indonesia",

    // Footer
    footerDesc: "Bringing the delicious taste of traditional Banyuwangi snacks with the highest quality for years.",
    footerNav: "NAVIGATION",
    footerInfo: "INFORMATION",
    footerSocial: "FOLLOW US",
    terms: "Terms & Conditions",
    privacy: "Privacy Policy",
    rights: "© 2026 Surya Snack. Authentic Indonesian Heritage.",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("id");

  useEffect(() => {
    const savedLang = localStorage.getItem("surya_lang") as Language;
    if (savedLang && (savedLang === "id" || savedLang === "en")) {
      setLangState(savedLang);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("surya_lang", newLang);
  };

  const t = (key: string): string => {
    return translations[lang][key] || translations["id"][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}