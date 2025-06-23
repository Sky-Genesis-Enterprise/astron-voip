const { SlashCommandBuilder } = require('discord.js');
const musicQueue = require('../../queue');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('▶️ Reprend la lecture de la musique.'),
    
    async execute(interaction) {
        const queue = musicQueue.getQueue(interaction.guildId);

        if (!queue.player || queue.player.state.status !== 'paused') {
            return interaction.reply({ content: "❌ Aucune musique n'est en pause.", ephemeral: true });
        }

        queue.player.unpause();
        await interaction.reply("▶️ **Musique reprise !**");
    }
};