const { SlashCommandBuilder } = require('discord.js');
const { searchYouTube } = require('../../utils/youtube');
const { convertSpotifyToYouTube } = require('../../utils/spotify');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription("🎵 Jouer une musique")
        .addStringOption(option =>
            option.setName('query')
                .setDescription("Lien YouTube, lien Spotify ou nom de la musique")
                .setRequired(true)
        ),

    async execute(interaction) {
        const query = interaction.options.getString('query');
        let url = query;

        // 🎵 Si c'est un lien Spotify, le convertir en YouTube
        if (query.includes("spotify.com/track")) {
            const video = await convertSpotifyToYouTube(query);
            if (!video) return interaction.reply("❌ Impossible de trouver cette musique sur YouTube.");
            url = video.url;
        }

        // 🔍 Si ce n'est pas un lien YouTube, effectuer une recherche
        if (!query.startsWith("http")) {
            const video = await searchYouTube(query);
            if (!video) return interaction.reply("❌ Aucune musique trouvée.");
            url = video.url;
        }

        // ➡️ Ajoute `url` à ta file d’attente et joue la musique comme avant
        interaction.reply(`🎶 **Ajouté à la file** : ${url}`);
    }
};