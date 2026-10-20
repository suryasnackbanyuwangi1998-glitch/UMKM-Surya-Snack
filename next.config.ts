import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Mengizinkan Next.js memuat gambar meskipun IP terdeteksi sebagai local/IPv6 transition
    dangerouslyAllowSVG: true,
    // Jika Next.js menuntut izin IP lokal untuk lingkungan development
    ...(process.env.NODE_ENV === "development" && {
      dangerouslyAllowLocalIP: true,
    }),
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "nqtopjidxipidlmgeebr.supabase.co",
      },
      {
        protocol: "https",
        hostname: "myurbilnvrikufrlhpzb.supabase.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;