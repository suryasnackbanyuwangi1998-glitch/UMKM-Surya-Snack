import { google } from 'googleapis';
import { Readable } from 'stream';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN?.trim(),
});

const drive = google.drive({ version: 'v3', auth: oauth2Client });

// Fungsi bantu untuk mencari atau otomatis membuat folder berdasarkan nama di Google Drive
async function getOrCreateFolder(folderName) {
  try {
    // 1. Cari apakah folder dengan nama tersebut sudah ada
    const searchResponse = await drive.files.list({
      q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}' and trashed=false`,
      fields: 'files(id, name)',
    });

    if (searchResponse.data.files && searchResponse.data.files.length > 0) {
      return searchResponse.data.files[0].id;
    }

    // 2. Jika belum ada, buat folder baru secara otomatis
    const folderMetadata = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
    };

    const createResponse = await drive.files.create({
      requestBody: folderMetadata,
      fields: 'id',
    });

    return createResponse.data.id;
  } catch (error) {
    console.error(`Gagal mencari/membuat folder ${folderName}:`, error);
    // Jika gagal membuat folder khusus, kembalikan folder ID utama sebagai cadangan
    return process.env.GOOGLE_FOLDER_ID?.trim();
  }
}

export async function uploadFileToDrive(fileBuffer, fileName, mimeType, customFolderName = null) {
  try {
    const bufferStream = new Readable();
    bufferStream.push(fileBuffer);
    bufferStream.push(null);

    // Tentukan folder tujuan: jika ada nama folder khusus (misal: 'heritage' atau 'banners'), cari/buat foldernya. 
    // Jika tidak ada, gunakan GOOGLE_FOLDER_ID utama.
    let targetFolderId = process.env.GOOGLE_FOLDER_ID?.trim();
    
    if (customFolderName) {
      targetFolderId = await getOrCreateFolder(customFolderName);
    }

    const response = await drive.files.create({
      requestBody: {
        name: fileName,
        parents: [targetFolderId],
      },
      media: {
        mimeType: mimeType,
        body: bufferStream,
      },
      fields: 'id, webViewLink',
    });

    const fileId = response.data.id;

    // Mengatur agar file bisa diakses publik (supaya langsung tampil di website)
    try {
      await drive.permissions.create({
        fileId: fileId,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });
    } catch (permError) {
      console.warn("Gagal mengubah izin file menjadi publik:", permError);
    }

    // Mengembalikan URL publik gambar Google Drive
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  } catch (error) {
    console.error("Gagal upload ke Google Drive:", error);
    throw new Error("Gagal mengunggah ke Google Drive: " + error.message);
  }
}