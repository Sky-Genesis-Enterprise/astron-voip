const { SlashCommandBuilder } = require('discord.js');
const musicQueue = require('../../queue');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('⏭️ Passe à la musique suivante.'),
    
    async execute(interaction) {
        const queue = musicQueue.getQueue(interaction.guildId);

        if (!queue.songs.length) {
            return interaction.reply({ content: "❌ Aucune musique suivante dans la file d'attente.", ephemeral: true });
        }

        await interaction.reply(`⏭️ **Musique passée !** Lecture de **${queue.songs[0].title}**`);
        queue.player.stop(); // Arrête la musique actuelle (le gestionnaire `playNext()` jouera la suivante)
    }
};