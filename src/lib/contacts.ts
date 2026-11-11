// src/lib/contacts.ts
import { supabase } from '@/lib/supabase';

/**
 * Format nomor telepon Indonesia menjadi format internasional untuk wa.me
 * Contoh: '089509604700' -> '6289509604700'
 */
export function formatWaNumber(num: string | null | undefined): string {
  if (!num) return '6289509604700';
  let clean = num.replace(/\D/g, '');
  if (clean.startsWith('0')) {
    clean = '62' + clean.slice(1);
  } else if (!clean.startsWith('62') && clean.length > 0) {
    clean = '62' + clean;
  }
  return clean || '6289509604700';
}

/**
 * Membuat tautan https://wa.me/... dengan teks opsional
 */
export function getWaLink(num?: string | null, text?: string): string {
  const formattedNum = formatWaNumber(num);
  if (text) {
    return `https://wa.me/${formattedNum}?text=${encodeURIComponent(text)}`;
  }
  return `https://wa.me/${formattedNum}`;
}

/**
 * Mengambil data kontak utama dari tabel contacts di Supabase
 */
export async function getStoreContact() {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('id', 'informasi_utama')
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Gagal mengambil kontak toko:', err);
    return null;
  }
}

