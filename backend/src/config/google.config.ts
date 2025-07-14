import fs from 'fs';
import path from 'path';

// Ler o arquivo JSON diretamente
const googleCredentials = JSON.parse(
    fs.readFileSync(
        path.join(process.cwd(), 'client_secret_922516559063-1oftq70gohbt8849sc8kds4bi9euhs37.apps.googleusercontent.com.json'),
        'utf8'
    )
);
export const googleConfig = {
    clientId: googleCredentials.web.client_id,
    clientSecret: googleCredentials.web.client_secret,
    redirectUri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/google/callback',
    scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'],
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo'
};