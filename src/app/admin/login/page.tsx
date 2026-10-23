"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faBolt, faStore } from "@fortawesome/free-solid-svg-icons";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      router.push("/admin/dashboard");
    }, 600);
  };

  // Mencegah render awal server agar tidak bentrok dengan ekstensi browser
  if (!isMounted) {
    return null;
  }

  return (
    <main className="min-h-screen flex items-center justify-center text-[#FDFBF7] font-serif p-4 selection:bg-[#5c0f1c] selection:text-amber-100 antialiased relative overflow-hidden bg-[#120c0a]">
      
      {/* ================= BACKGROUND TOKO MEWAH & ARTISAN ================= */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat filter brightness-[0.45] contrast-125 scale-105 transition-transform duration-1000"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1920')` }}
        />
        <div className="absolute inset-0 bg-linear-to-tr from-[#1a0508]/90 via-[#2d0a10]/70 to-[#120c0a]/80 backdrop-blur-[3px]"></div>
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#5c0f1c]/30 rounded-full blur-[120px] pointer-events-none"></div>
      </div>

      {/* ================= KARTU CONTAINER UTAMA ================= */}
      <div className="max-w-md w-full bg-[#1e1513]/85 backdrop-blur-xl border border-amber-500/30 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-8 sm:p-10 space-y-6 relative z-10 overflow-hidden ring-1 ring-amber-400/20 transform transition-all duration-700 ease-out animate-in fade-in slide-in-from-bottom-6">
        
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-amber-400 to-transparent opacity-70"></div>

        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-amber-200/70 hover:text-amber-300 transition-colors duration-200 font-sans tracking-wide"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-3" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-tr from-[#3b0912] via-[#5c0f1c] to-amber-700 text-amber-300 shadow-xl mx-auto text-xl border border-amber-400/40 transition-transform duration-300 hover:scale-105">
            <FontAwesomeIcon icon={faStore} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-wide text-amber-100">
            Surya Snack Boutique
          </h1>
          <p className="text-xs text-amber-300/70 font-sans tracking-[0.2em] uppercase">
            ✦ Admin Management Portal ✦
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 font-sans">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-amber-200/70 mb-1.5">
              Email Akses
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#120c0a]/90 border border-amber-900/50 rounded-xl px-4 py-3 text-sm text-amber-100 placeholder-gray-500 focus:outline-none focus:border-amber-400 transition-all shadow-inner"
              readOnly
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-widest text-amber-200/70 mb-1.5">
              Password Keamanan
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#120c0a]/90 border border-amber-900/50 rounded-xl px-4 py-3 text-sm text-amber-100 placeholder-gray-500 focus:outline-none focus:border-amber-400 transition-all shadow-inner"
              readOnly
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-linear-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-[#1a0306] font-extrabold py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-xl shadow-amber-900/40 cursor-pointer text-xs uppercase tracking-widest border border-amber-300/50 hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? (
              <span className="inline-block w-5 h-5 border-2 border-[#1a0306] border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <FontAwesomeIcon icon={faBolt} className="text-[#1a0306]" />
                <span>Masuk Dashboard Instan</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center text-[11px] text-amber-200/40 border-t border-amber-900/30 pt-4 font-sans tracking-widest uppercase">
          Elegance in Every Tradition © 2026
        </div>

      </div>
    </main>
  );
}