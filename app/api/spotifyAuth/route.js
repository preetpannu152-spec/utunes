import querystring from 'querystring';

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;
const SCOPES = [
  'user-read-private',
  'user-read-email',
  'user-top-read',
  'user-read-currently-playing'
];

export async function GET(req) {
  const params = querystring.stringify({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    scope: SCOPES.join(' ')
  });

  return Response.redirect(`https://accounts.spotify.com/authorize?${params}`, 302);
}