const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const credentialsPath = path.join(__dirname, 'credentials.json');
const credentials = require(credentialsPath);

const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

const SCOPES = ['https://www.googleapis.com/auth/drive'];

const authUrl = oAuth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
});

console.log('\n🔗 Buka link ini di browser untuk login:');
console.log(authUrl);
console.log('\nSetelah login, copy URL dari address bar, lalu paste di bawah ini:\n');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Paste URL di sini: ', (codeUrl) => {
  try {
    const url = new URL(codeUrl);
    const code = url.searchParams.get('code');

    if (!code) {
      throw new Error('Kode tidak ditemukan di URL');
    }

    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('❌ Error:', err.message);
      
      oAuth2Client.setCredentials(token);
      
      const tokenPath = path.join(__dirname, 'token.json');
      fs.writeFileSync(tokenPath, JSON.stringify(token));
      
      console.log('\n✅ Berhasil! Token disimpan di token.json');
      console.log('Ambil refresh_token dari file token.json untuk dimasukkan ke .env');
      rl.close();
    });
  } catch (error) {
    console.error('❌ URL tidak valid:', error.message);
    rl.close();
  }
});