const {SlashCommandBuilder } = require('discord.js')

let queue = [];  // Exemple de file d'attente

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear-queue')
        .setDescription('Vide la file d\'attente musicale.'),

    async execute(interaction) {
        // Vider la file d'attente
        queue.length = 0;  // Vide complètement la file d'attente
        return interaction.reply("✅ La file d'attente musicale a été vidée.");
    }
};