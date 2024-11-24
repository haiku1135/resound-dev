import SpotifyWebApi from "spotify-web-api-node";


// Spotify APIを初期化
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/spotify`,
});

// アクセストークンを取得
async function getAccessToken() {
  try{
    const credentials = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(credentials.body.access_token);
    return credentials.body.access_token;
  } catch (error) {
    console.error("Error getting access token", error);
    throw error;
  }
}

// アーティストのトップトラックを取得
export async function getArtistTopTracks(artistId: string) {
  await getAccessToken();

  try{
    const data = await spotifyApi.getArtistTopTracks(artistId, 'JP');
    return data.body.tracks;
  } catch (error) {
    console.error("Error getting artist top tracks", error);
    throw error;
  }
};

// トラックを検索
export async function searchTracks(query: string) {
  await getAccessToken();

  try{
    const data = await spotifyApi.searchTracks(query);
    return data.body.tracks?.items || [];
  } catch (error) {
    console.error("Error searching tracks", error);
    throw error;
  }
}