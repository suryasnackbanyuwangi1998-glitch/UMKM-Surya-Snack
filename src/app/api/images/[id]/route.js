import { NextResponse } from 'next/server';
import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN?.trim(),
});

const drive = google.drive({ version: 'v3', auth: oauth2Client });

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return new NextResponse('Image ID is required', { status: 400 });
    }

    // 1. Ambil metadata file dari Google Drive untuk mengetahui jenis mimeType-nya (misal: image/jpeg, image/png)
    const fileMeta = await drive.files.get({
      fileId: id,
      fields: 'mimeType',
    });

    const mimeType = fileMeta.data.mimeType || 'image/jpeg';

    // 2. Ambil data biner file dari Google Drive sebagai stream
    const response = await drive.files.get(
      {
        fileId: id,
        alt: 'media',
      },
      { responseType: 'stream' }
    );

    // 3. Ubah Node.js Readable Stream ke Web API ReadableStream agar kompatibel dengan Response Next.js
    const readableStream = new ReadableStream({
      start(controller) {
        response.data.on('data', (chunk) => controller.enqueue(chunk));
        response.data.on('end', () => controller.close());
        response.data.on('error', (err) => controller.error(err));
      },
    });

    // 4. Kembalikan response berupa stream gambar ke browser
    return new Response(readableStream, {
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=31536000, immutable', // Cache gambar agar cepat dimuat
      },
    });
  } catch (error) {
    console.error('Gagal mengambil gambar dari Google Drive:', error);
    return new Response('Image not found', { status: 404 });
  }
}