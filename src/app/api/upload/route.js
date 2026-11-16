import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ success: false, error: 'File tidak ditemukan' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Tentukan folder public/uploads
    const uploadDir = path.join(process.cwd(), 'public/uploads');

    // Otomatis buat folder jika belum ada
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (err) {
      console.error('Gagal membuat folder uploads:', err);
    }

    // Buat nama file unik
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const filePath = path.join(uploadDir, filename);

    // Simpan file secara lokal
    await writeFile(filePath, buffer);

    // URL path lokal
    const imageUrl = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      imageUrl: imageUrl,
    });

  } catch (error) {
    console.error('Error Local Upload:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}