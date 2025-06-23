const { SlashCommandBuilder } = require('discord.js');
const musicQueue = require('../../queue');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('⏸️ Met en pause la musique actuelle.'),
    
    async execute(interaction) {
        const queue = musicQueue.getQueue(interaction.guildId);

        if (!queue.player || queue.player.state.status !== 'playing') {
            return interaction.reply({ content: "❌ Aucune musique en cours de lecture.", ephemeral: true });
        }

        queue.player.pause();
        await interaction.reply("⏸️ **Musique mise en pause.** Utilisez `/resume` pour reprendre.");
    }
};