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
    
    if (!id || id === 'undefined' || id === 'null') {
      return new NextResponse('ID tidak valid', { status: 400 });
    }

    // Ambil metadata file dulu untuk memastikan tipe file-nya (opsional, untuk Content-Type akurat)
    const fileMeta = await drive.files.get({ fileId: id, fields: 'mimeType' });
    const mimeType = fileMeta.data.mimeType || 'image/jpeg';

    // Ambil file langsung sebagai stream dari Google Drive
    const response = await drive.files.get(
      { fileId: id, alt: 'media' },
      { responseType: 'stream' }
    );

    return new NextResponse(response.data, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Gagal memuat gambar dari Drive:', error.message);
    return new NextResponse('Gambar tidak ditemukan', { status: 404 });
  }
}