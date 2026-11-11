'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { formatWaNumber, getWaLink } from '@/lib/contacts';

interface ContactContextType {
  whatsapp1: string;
  whatsapp2: string;
  waNumber: string; // Format bersih untuk wa.me, misal "6289509604700"
  getWaLink: (text?: string) => string;
  instagram: string;
  alamat: string;
  tiktok: string;
  loading: boolean;
}

const defaultWa = '6289509604700';

const ContactContext = createContext<ContactContextType>({
  whatsapp1: '089509604700',
  whatsapp2: '',
  waNumber: defaultWa,
  getWaLink: (text?: string) => getWaLink(defaultWa, text),
  instagram: 'suryasnack.banyuwangi',
  alamat: 'Jl. Barong No. 110, Bakungan, Kec. Glagah, Banyuwangi 68431',
  tiktok: 'suryasnack_',
  loading: true,
});

export function ContactProvider({ children }: { children: React.ReactNode }) {
  const [contacts, setContacts] = useState({
    whatsapp1: '089509604700',
    whatsapp2: '',
    instagram: 'suryasnack.banyuwangi',
    alamat: 'Jl. Barong No. 110, Bakungan, Kec. Glagah, Banyuwangi 68431',
    tiktok: 'suryasnack_',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContact() {
      try {
        const { data, error } = await supabase
          .from('contacts')
          .select('*')
          .eq('id', 'informasi_utama')
          .maybeSingle();

        if (error) throw error;
        if (data) {
          setContacts({
            whatsapp1: data.whatsapp1 || '089509604700',
            whatsapp2: data.whatsapp2 || '',
            instagram: data.instagram || 'suryasnack.banyuwangi',
            alamat: data.alamat || '',
            tiktok: data.tiktok || 'suryasnack_',
          });
        }
      } catch (err) {
        console.error('Gagal memuat kontak dari Supabase:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchContact();
  }, []);

  const waNumber = formatWaNumber(contacts.whatsapp1);

  const contextValue: ContactContextType = {
    whatsapp1: contacts.whatsapp1,
    whatsapp2: contacts.whatsapp2,
    waNumber,
    getWaLink: (text?: string) => getWaLink(waNumber, text),
    instagram: contacts.instagram,
    alamat: contacts.alamat,
    tiktok: contacts.tiktok,
    loading,
  };

  return (
    <ContactContext.Provider value={contextValue}>
      {children}
    </ContactContext.Provider>
  );
}

export function useStoreContact() {
  return useContext(ContactContext);
}

