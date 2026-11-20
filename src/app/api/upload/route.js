// src/app/api/upload/route.js
import { NextResponse } from 'next/server';
import { uploadFileToDrive } from '@/lib/googleDrive';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') || formData.get('imageFile');
    const folderName =
      formData.get('folder') ||
      formData.get('section') ||
      'pengaturan';

    if (!file || typeof file !== 'object') {
      return NextResponse.json(
        { success: false, error: 'File tidak ditemukan' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const safeFolder = String(folderName).trim() || 'pengaturan';
    const fileName = `${safeFolder}-${Date.now()}-${file.name}`;

    const imageUrl = await uploadFileToDrive(
      buffer,
      fileName,
      file.type || 'image/jpeg',
      safeFolder
    );

    if (!imageUrl) {
      throw new Error('Gagal mendapatkan URL dari Google Drive');
    }

    return NextResponse.json({
      success: true,
      imageUrl,
      folder: safeFolder,
    });
  } catch (error) {
    console.error('Error Google Drive Upload:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal mengunggah ke Google Drive' },
      { status: 500 }
    );
  }
}