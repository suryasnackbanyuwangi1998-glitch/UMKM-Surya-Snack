// src/app/api/banners/route.js
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { google } from 'googleapis';
import { Readable } from 'stream';

async function uploadBannerToDrive(buffer, fileName, mimeType) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN ? process.env.GOOGLE_REFRESH_TOKEN.trim() : '',
  });

  const drive = google.drive({ version: 'v3', auth: oauth2Client });
  const parentFolderId = process.env.GOOGLE_FOLDER_ID;

  let bannerFolderId = parentFolderId;
  if (parentFolderId) {
    try {
      const searchResponse = await drive.files.list({
        q: `name='banner' and mimeType='application/vnd.google-apps.folder' and '${parentFolderId}' in parents and trashed=false`,
        fields: 'files(id, name)',
      });

      if (searchResponse.data.files && searchResponse.data.files.length > 0) {
        bannerFolderId = searchResponse.data.files[0].id;
      } else {
        const createFolderResponse = await drive.files.create({
          requestBody: {
            name: 'banner',
            mimeType: 'application/vnd.google-apps.folder',
            parents: [parentFolderId],
          },
          fields: 'id',
        });
        bannerFolderId = createFolderResponse.data.id;
      }
    } catch (folderError) {
      console.error('Gagal membuat/mencari folder banner:', folderError);
    }
  }

  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);

  const response = await drive.files.create({
    requestBody: {
      name: `banner-${Date.now()}-${fileName}`,
      parents: [bannerFolderId],
    },
    media: {
      mimeType: mimeType,
      body: stream,
    },
    fields: 'id, thumbnailLink',
  });

  const fileId = response.data.id;

  // Berikan izin publik
  try {
    await drive.permissions.create({
      fileId: fileId,
      requestBody: { role: 'reader', type: 'anyone' },
    });
  } catch (e) {
    console.error("Gagal set permission:", e);
  }

  // Ambil metadata detail untuk mendapatkan thumbnailLink atau webContentLink
  const fileMeta = await drive.files.get({
    fileId: fileId,
    fields: 'thumbnailLink, webContentLink',
  });

  // Ubah ukuran thumbnail Google Drive agar tajam (ubah s220 menjadi s1600)
  let imageUrl = fileMeta.data.thumbnailLink 
    ? fileMeta.data.thumbnailLink.replace('=s220', '=s1600') 
    : `https://lh3.googleusercontent.com/d/${fileId}`;

  return imageUrl;
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("store_banners")
      .select("*")
      .order("banner_number", { ascending: true });

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get("imageFile");
    const banner_number = formData.get("banner_number") ? parseInt(formData.get("banner_number")) : 1;
    const title = formData.get("title") || "Banner Promosi";

    let image_url = "";
    if (imageFile && typeof imageFile === "object" && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      image_url = await uploadBannerToDrive(buffer, imageFile.name, imageFile.type);
    }

    const { data, error } = await supabase
      .from("store_banners")
      .insert([{ title, description: "EMPTY", image_url, banner_number }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, message: "Banner berhasil disimpan!", data });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const formData = await request.formData();
    const id = formData.get("id");
    const imageFile = formData.get("imageFile");
    const banner_number = formData.get("banner_number") ? parseInt(formData.get("banner_number")) : 1;
    const title = formData.get("title");

    if (!id) {
      return NextResponse.json({ success: false, message: "ID Banner tidak ditemukan" }, { status: 400 });
    }

    const { data: existingBanner, error: fetchError } = await supabase
      .from("store_banners")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;

    let image_url = existingBanner.image_url;

    if (imageFile && typeof imageFile === "object" && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      image_url = await uploadBannerToDrive(buffer, imageFile.name, imageFile.type);
    }

    const { data, error } = await supabase
      .from("store_banners")
      .update({
        title: title || existingBanner.title,
        banner_number,
        image_url,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, message: "Banner berhasil diperbarui!", data });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const { error } = await supabase.from("store_banners").delete().eq("id", id);
    if (error) throw error;

    return NextResponse.json({ success: true, message: "Banner berhasil dihapus" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}