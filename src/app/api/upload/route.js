import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { createClient } from '@supabase/supabase-js';
import { Readable } from 'stream';

// Inisialisasi Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Konfigurasi Google Drive OAuth2
const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost'
);

oAuth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const drive = google.drive({ version: 'v3', auth: oAuth2Client });

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const namaProduk = formData.get('nama_produk');
    const harga = formData.get('harga');

    if (!file) {
      return NextResponse.json({ success: false, message: 'File gambar tidak ditemukan!' }, { status: 400 });
    }

    // Ubah file dari form menjadi buffer untuk di-upload ke Google Drive
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const bufferStream = new Readable();
    bufferStream.push(buffer);
    bufferStream.push(null);

    // 1. Upload file ke Google Drive
    const response = await drive.files.create({
      requestBody: {
        name: `${Date.now()}-${file.name}`,
        parents: [process.env.GOOGLE_FOLDER_ID], // Masuk ke folder Google Drive Surya Snack
      },
      media: {
        mimeType: file.type,
        body: bufferStream,
      },
      fields: 'id, webViewLink, webContentLink',
    });

    const fileId = response.data.id;
    const fileUrl = response.data.webViewLink;

    // 2. Set izin file di Google Drive agar bisa diakses publik (opsional, agar gambar bisa langsung dirender)
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    // 3. Simpan data produk dan link gambar ke Supabase
    const { data, error } = await supabase
      .from('produk_surya_snack') // Sesuaikan dengan nama tabel di Supabase kamu
      .insert([
        {
          nama_produk: namaProduk,
          harga: harga,
          gambar_url: fileUrl,
          drive_file_id: fileId,
        },
      ]);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'Berhasil upload gambar ke Google Drive dan simpan ke Supabase!',
      data: { fileUrl, namaProduk, harga },
    });

  } catch (error) {
    console.error('Error saat upload:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}