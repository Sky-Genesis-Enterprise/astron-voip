const axios = require('axios');
const qs = require('qs');
const { searchYouTube } = require('./youtube');

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

// 🔑 Obtenir un token d'accès Spotify
async function getSpotifyToken() {
    const tokenUrl = "https://accounts.spotify.com/api/token";
    const headers = {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        auth: { username: SPOTIFY_CLIENT_ID, password: SPOTIFY_CLIENT_SECRET },
    };
    const data = qs.stringify({ grant_type: "client_credentials" });

    try {
        const response = await axios.post(tokenUrl, data, headers);
        return response.data.access_token;
    } catch (error) {
        console.error("❌ Erreur API Spotify :", error);
        return null;
    }
}

// 🎵 Récupérer les infos d'une musique Spotify
async function getSpotifyTrack(spotifyUrl) {
    const trackId = spotifyUrl.split("/track/")[1]?.split("?")[0];
    if (!trackId) return null;

    const token = await getSpotifyToken();
    if (!token) return null;

    try {
        const response = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const track = response.data;
        return `${track.name} ${track.artists[0].name}`;
    } catch (error) {
        console.error("❌ Impossible de récupérer la musique Spotify :", error);
        return null;
    }
}

// 🔄 Convertir un lien Spotify en une musique YouTube
async function convertSpotifyToYouTube(spotifyUrl) {
    const trackName = await getSpotifyTrack(spotifyUrl);
    if (!trackName) return null;
    return await searchYouTube(trackName);
}

module.exports = { convertSpotifyToYouTube };