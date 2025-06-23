const axios = require('axios');

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";

async function searchYouTube(query) {
    try {
        const response = await axios.get(YOUTUBE_SEARCH_URL, {
            params: {
                part: "snippet",
                q: query,
                key: YOUTUBE_API_KEY,
                maxResults: 1,
                type: "video"
            }
        });

        if (response.data.items.length === 0) return null;

        const video = response.data.items[0];
        return {
            title: video.snippet.title,
            url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
            thumbnail: video.snippet.thumbnails.high.url,
            channel: video.snippet.channelTitle
        };
    } catch (error) {
        console.error("❌ Erreur API YouTube :", error);
        return null;
    }
}

module.exports = { searchYouTube };