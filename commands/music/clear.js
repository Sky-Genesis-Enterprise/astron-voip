const { SlashCommandBuilder } = require('discord.js');
const musicQueue = require('../../queue');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('🗑️ Vide la file d’attente et arrête la musique.'),
    
    async execute(interaction) {
        const queue = musicQueue.getQueue(interaction.guildId);

        if (!queue.songs.length) {
            return interaction.reply({ content: "❌ La file d'attente est déjà vide.", ephemeral: true });
        }

        queue.songs = []; // Vide la liste des musiques
        queue.player.stop(); // Arrête la lecture

        await interaction.reply("🗑️ **File d’attente vidée et lecture arrêtée.**");
    }
};