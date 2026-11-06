// src/app/api/images/[id]/route.js
import { google } from 'googleapis';
import { NextResponse } from 'next/server';

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost'
);

oAuth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const drive = google.drive({ version: 'v3', auth: oAuth2Client });

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    // Ambil file langsung sebagai stream dari Google Drive menggunakan kredensial backend
    const response = await drive.files.get(
      { fileId: id, alt: 'media' },
      { responseType: 'stream' }
    );

    // Ubah stream Google Drive menjadi response gambar untuk browser
    return new NextResponse(response.data, {
      headers: {
        'Content-Type': 'image/*',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Gagal memuat gambar dari Drive:', error);
    return new NextResponse('Gambar tidak ditemukan', { status: 404 });
  }
}