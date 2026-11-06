// src/lib/googleDrive.js
import { google } from 'googleapis';
import { Readable } from 'stream';

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost'
);

oAuth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const drive = google.drive({ version: 'v3', auth: oAuth2Client });

export async function uploadFileToDrive(file) {
  if (!file) return null;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const bufferStream = new Readable();
  bufferStream.push(buffer);
  bufferStream.push(null);

  // Upload file ke Google Drive
  const response = await drive.files.create({
    requestBody: {
      name: `${Date.now()}-${file.name}`,
      parents: [process.env.GOOGLE_FOLDER_ID],
    },
    media: {
      mimeType: file.type,
      body: bufferStream,
    },
    fields: 'id',
  });

  const fileId = response.data.id;

  // Kembalikan URL proxy lokal yang aman dari CORB
  return `/api/images/${fileId}`;
}