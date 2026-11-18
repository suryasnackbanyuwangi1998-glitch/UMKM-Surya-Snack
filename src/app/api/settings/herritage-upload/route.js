// src/app/api/settings/heritage-upload/route.js
import { NextResponse } from "next/server";
import { uploadFileToDrive } from "@/lib/googleDrive";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get("imageFile");

    if (!imageFile || typeof imageFile !== "object") {
      return NextResponse.json(
        { success: false, message: "File gambar tidak ditemukan" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const fileName = `heritage-${Date.now()}-${imageFile.name}`;
    
    // Mengunggah ke Google Drive menggunakan fungsi server-side yang sudah ada
    const imageUrl = await uploadFileToDrive(buffer, fileName, imageFile.type);

    return NextResponse.json({ success: true, imageUrl });
  } catch (error) {
    console.error("Error upload heritage ke Google Drive:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Gagal mengunggah ke Google Drive" },
      { status: 500 }
    );
  }
}