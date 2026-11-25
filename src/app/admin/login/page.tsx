// src/app/admin/login/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faStore, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const DEFAULT_LOGIN_BG =
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1920";
const CACHE_KEY = "surya_snack_login_bg";

function normalizeDriveImageUrl(url?: string): string {
  const trimmed = (url || "").trim();
  if (!trimmed) return DEFAULT_LOGIN_BG;

  const lh3Match = trimmed.match(/lh3\.googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/);
  if (lh3Match?.[1]) return `https://lh3.googleusercontent.com/d/${lh3Match[1]}`;

  const fileMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch?.[1]) return `https://lh3.googleusercontent.com/d/${fileMatch[1]}`;

  const queryMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (trimmed.includes("drive.google.com") && queryMatch?.[1]) {
    return `https://lh3.googleusercontent.com/d/${queryMatch[1]}`;
  }

  return trimmed;
}

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [bgImageUrl, setBgImageUrl] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);

    const cachedBg = localStorage.getItem(CACHE_KEY);
    if (cachedBg) {
      setBgImageUrl(cachedBg);
    }

    async function fetchLoginBackground() {
      const { data } = await supabase
        .from("store_settings")
        .select("login_bg_url")
        .eq("id", "main")
        .maybeSingle();

      const resolvedUrl = data?.login_bg_url
        ? normalizeDriveImageUrl(data.login_bg_url)
        : DEFAULT_LOGIN_BG;

      setBgImageUrl(resolvedUrl);
      localStorage.setItem(CACHE_KEY, resolvedUrl);
    }

    fetchLoginBackground();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error("Email atau password salah, atau akun tidak terdaftar.");
      }

      if (data.session) {
        router.push("/admin/dashboard");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Gagal masuk ke sistem.");
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <main className="min-h-screen flex items-center justify-center text-[#3b0912] font-serif p-4 selection:bg-[#5c0f1c] selection:text-white antialiased relative overflow-hidden bg-[#f4efe9]">
      
      {/* ================= BACKGROUND FOTO JERNIH ASLI ================= */}
      <div className="absolute inset-0 z-0">
        {bgImageUrl && (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-100 transition-opacity duration-500"
            style={{ backgroundImage: `url('${bgImageUrl}')` }}
          />
        )}
      </div>

      {/* ================= KARTU CONTAINER UTAMA (CLEAR BLUR GLASS) ================= */}
      <div className="max-w-md w-full bg-white/15 backdrop-blur-lg border border-white/45 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.18)] p-8 sm:p-10 space-y-6 relative z-10 overflow-hidden transform transition-all duration-700 ease-out">
        
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#3b0912] hover:text-[#5c0f1c] transition-colors duration-200 font-sans tracking-wide [text-shadow:0_1px_8px_rgba(255,255,255,0.85)]"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-3" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

        <div className="text-center space-y-2.5">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#3b0912] text-white shadow-md mx-auto text-xl border border-white/30 transition-transform duration-300 hover:scale-105">
            <FontAwesomeIcon icon={faStore} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-wide text-[#3b0912] [text-shadow:0_1px_12px_rgba(255,255,255,0.9)]">
            Surya Snack
          </h1>
          <p className="text-[11px] font-bold text-[#3b0912] font-sans tracking-[0.2em] uppercase [text-shadow:0_1px_8px_rgba(255,255,255,0.85)]">
            ✦ Admin Management Portal ✦
          </p>
        </div>

        {/* Notifikasi Error jika login gagal */}
        {errorMessage && (
          <div className="p-3 rounded-xl text-xs font-sans font-semibold text-center border bg-rose-50/90 backdrop-blur-sm border-rose-300 text-rose-800">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 font-sans" autoComplete="off">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-[#3b0912] mb-1.5 [text-shadow:0_1px_8px_rgba(255,255,255,0.85)]">
              Email Akses Pemilik
            </label>
            <input
              type="email"
              required
              autoComplete="off"
              placeholder="Masukkan email admin..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/35 backdrop-blur-sm border border-white/60 rounded-xl px-4 py-3 text-sm text-[#3b0912] font-medium placeholder-[#3b0912]/60 focus:outline-none focus:bg-white/55 focus:border-[#5c0f1c] focus:ring-2 focus:ring-[#5c0f1c]/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-[#3b0912] mb-1.5 [text-shadow:0_1px_8px_rgba(255,255,255,0.85)]">
              Password Keamanan
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                autoComplete="new-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/35 backdrop-blur-sm border border-white/60 rounded-xl pl-4 pr-12 py-3 text-sm text-[#3b0912] font-medium placeholder-[#3b0912]/60 focus:outline-none focus:bg-white/55 focus:border-[#5c0f1c] focus:ring-2 focus:ring-[#5c0f1c]/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#3b0912]/80 hover:text-[#3b0912] transition-colors cursor-pointer p-1"
                title={showPassword ? "Sembunyikan password" : "Lihat password"}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="w-4 h-4" />
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-[#3b0912] hover:bg-[#5c0f1c] text-white font-extrabold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg cursor-pointer text-xs uppercase tracking-widest hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <span>Masuk ke Dashboard</span>
            )}
          </button>
        </form>

        <div className="text-center text-[10px] font-bold text-[#3b0912] border-t border-white/40 pt-4 font-sans tracking-widest uppercase [text-shadow:0_1px_8px_rgba(255,255,255,0.85)]">
          Elegance in Every Tradition © 2026
        </div>

      </div>
    </main>
  );
}