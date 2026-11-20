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

// Cache di memori agar tidak perlu query list folder berulang kali
const folderCache = new Map();

async function getOrCreateFolder(folderName) {
  const cleanName = String(folderName || "").trim();
  if (!cleanName) {
    return process.env.GOOGLE_FOLDER_ID?.trim();
  }

  if (folderCache.has(cleanName)) {
    return folderCache.get(cleanName);
  }

  try {
    const escapedName = cleanName.replace(/'/g, "\\'");
    const searchResponse = await drive.files.list({
      q: `mimeType='application/vnd.google-apps.folder' and name='${escapedName}' and trashed=false`,
      fields: "files(id, name)",
      spaces: "drive",
      pageSize: 1,
    });

    if (searchResponse.data.files && searchResponse.data.files.length > 0) {
      const existingId = searchResponse.data.files[0].id;
      folderCache.set(cleanName, existingId);
      return existingId;
    }

    const folderMetadata = {
      name: cleanName,
      mimeType: "application/vnd.google-apps.folder",
    };

    const createResponse = await drive.files.create({
      requestBody: folderMetadata,
      fields: "id",
    });

    const newId = createResponse.data.id;
    if (newId) {
      folderCache.set(cleanName, newId);
      return newId;
    }

    return process.env.GOOGLE_FOLDER_ID?.trim();
  } catch (error) {
    console.error(`Gagal mencari/membuat folder ${cleanName}:`, error);
    return process.env.GOOGLE_FOLDER_ID?.trim();
  }
}

export async function uploadFileToDrive(
  fileBuffer,
  fileName,
  mimeType,
  customFolderName = null
) {
  try {
    const bufferStream = new Readable();
    bufferStream.push(fileBuffer);
    bufferStream.push(null);

    let targetFolderId = process.env.GOOGLE_FOLDER_ID?.trim();
    if (customFolderName) {
      targetFolderId = await getOrCreateFolder(customFolderName);
    }

    const response = await drive.files.create({
      requestBody: {
        name: fileName,
        parents: targetFolderId ? [targetFolderId] : undefined,
      },
      media: {
        mimeType: mimeType || "image/jpeg",
        body: bufferStream,
      },
      fields: "id, webViewLink",
    });

    const fileId = response.data.id;

    try {
      await drive.permissions.create({
        fileId,
        requestBody: {
          role: "reader",
          type: "anyone",
        },
      });
    } catch (permError) {
      console.warn("Gagal mengubah izin file menjadi publik:", permError);
    }

    return `https://lh3.googleusercontent.com/d/${fileId}`;
  } catch (error) {
    console.error("Gagal upload ke Google Drive:", error);
    throw new Error("Gagal mengunggah ke Google Drive: " + error.message);
  }
}