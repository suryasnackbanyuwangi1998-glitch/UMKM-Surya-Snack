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

export async function uploadFileToDrive(fileBuffer, fileName, mimeType) {
  try {
    const bufferStream = new Readable();
    bufferStream.push(fileBuffer);
    bufferStream.push(null);

    const response = await drive.files.create({
      requestBody: {
        name: fileName,
        parents: [process.env.GOOGLE_FOLDER_ID?.trim()],
      },
      media: {
        mimeType: mimeType,
        body: bufferStream,
      },
      fields: 'id',
    });

    return response.data.id; // Mengembalikan Google Drive File ID
  } catch (error) {
    console.error("Gagal upload ke Google Drive:", error);
    throw new Error("Gagal mengunggah ke Google Drive: " + error.message);
  }
}