const { SlashCommandBuilder } = require('@discordjs/builders');
const { Player } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('⏹️ Arrête la musique et vide la file d’attente'),

    async execute(interaction) {
        const player = Player.singleton(interaction.client);
        const queue = player.nodes.get(interaction.guild.id);

        if (!queue || !queue.isPlaying()) {
            return interaction.reply({ content: "❌ Aucune musique en cours.", ephemeral: true });
        }

        queue.delete(); // Supprime la file d’attente et déconnecte le bot
        interaction.reply({ content: "⏹️ Lecture arrêtée et file d’attente vidée." });
    }
};