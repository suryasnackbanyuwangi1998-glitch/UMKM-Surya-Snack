// src/lib/googleDrive.js
import { google } from "googleapis";
import { Readable } from "stream";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN?.trim(),
});

const drive = google.drive({ version: "v3", auth: oauth2Client });

export async function uploadFileToDrive(
  fileBuffer,
  fileName,
  mimeType
) {
  try {
    const bufferStream = Readable.from(fileBuffer);
    const targetFolderId = process.env.GOOGLE_FOLDER_ID?.trim();

    // Langsung upload ke folder Google Drive yang sudah dibuat (GOOGLE_FOLDER_ID)
    // dalam 1x request tanpa pencarian folder berulang
    const response = await drive.files.create({
      requestBody: {
        name: fileName,
        parents: targetFolderId ? [targetFolderId] : undefined,
      },
      media: {
        mimeType: mimeType || "image/jpeg",
        body: bufferStream,
      },
      fields: "id",
    });

    const fileId = response.data.id;
    if (!fileId) {
      throw new Error("ID file tidak dikembalikan oleh Google Drive");
    }

    // Jalankan pengaturan izin di latar belakang (non-blocking) sebagai cadangan
    // jika folder induk belum diset publik
    drive.permissions
      .create({
        fileId,
        requestBody: {
          role: "reader",
          type: "anyone",
        },
      })
      .catch((permError) => {
        console.warn("Info izin file Drive:", permError?.message);
      });

    return `https://lh3.googleusercontent.com/d/${fileId}`;
  } catch (error) {
    console.error("Gagal upload ke Google Drive:", error);
    throw new Error("Gagal mengunggah ke Google Drive: " + error.message);
  }
}