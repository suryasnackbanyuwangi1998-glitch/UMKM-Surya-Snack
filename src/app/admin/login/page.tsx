// src/app/admin/login/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faBolt, faStore } from "@fortawesome/free-solid-svg-icons";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
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
    <main className="min-h-screen flex items-center justify-center text-[#FDFBF7] font-serif p-4 selection:bg-[#5c0f1c] selection:text-amber-100 antialiased relative overflow-hidden bg-[#120c0a]">
      
      {/* ================= BACKGROUND FOTO TAJAM (TIDAK BLUR) ================= */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat filter brightness-[0.55] contrast-100 scale-100 transition-transform duration-1000"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1920')` }}
        />
        <div className="absolute inset-0 bg-linear-to-tr from-[#1a0508]/60 via-[#2d0a10]/40 to-[#120c0a]/50"></div>
      </div>

      {/* ================= KARTU CONTAINER UTAMA (TANPA KUNING) ================= */}
      <div className="max-w-md w-full bg-[#1e1513]/25 backdrop-blur-md border border-white/10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] p-8 sm:p-10 space-y-6 relative z-10 overflow-hidden transform transition-all duration-700 ease-out">
        
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-300 hover:text-white transition-colors duration-200 font-sans tracking-wide"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-3" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-tr from-[#3b0912]/80 via-[#5c0f1c]/80 to-[#2d0a10] text-gray-200 shadow-xl mx-auto text-xl border border-white/10 transition-transform duration-300 hover:scale-105">
            <FontAwesomeIcon icon={faStore} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-wide text-white drop-shadow-md">
            Surya Snack
          </h1>
          <p className="text-xs text-gray-400 font-sans tracking-[0.2em] uppercase">
            ✦ Admin Management Portal ✦
          </p>
        </div>

        {/* Notifikasi Error jika login gagal */}
        {errorMessage && (
          <div className="p-3 rounded-xl text-xs font-sans text-center border bg-rose-500/20 border-rose-500/40 text-rose-200 backdrop-blur-sm">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 font-sans" autoComplete="off">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-300 mb-1.5">
              Email Akses Pemilik
            </label>
            <input
              type="email"
              required
              autoComplete="off"
              placeholder="Masukkan email admin..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#120c0a]/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-white/30 transition-all shadow-inner backdrop-blur-xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-300 mb-1.5">
              Password Keamanan
            </label>
            <input
              type="password"
              required
              autoComplete="new-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#120c0a]/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-white/30 transition-all shadow-inner backdrop-blur-xs"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-linear-to-r from-gray-200 via-white to-gray-300 hover:from-white hover:to-gray-200 text-[#1a0306] font-extrabold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-xl cursor-pointer text-xs uppercase tracking-widest border border-white/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-block w-5 h-5 border-2 border-[#1a0306] border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <span>Masuk ke Dashboard</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center text-[11px] text-gray-500 border-t border-white/10 pt-4 font-sans tracking-widest uppercase">
          Elegance in Every Tradition © 2026
        </div>

      </div>
    </main>
  );
}