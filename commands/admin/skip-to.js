const {SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip-to')
        .setDescription('Passe à la chanson à un index spécifique dans la file d\'attente.')
        .addIntegerOption(option =>
            option.setName('index')
                .setDescription('L\'index de la chanson dans la file d\'attente.')
                .setRequired(true)),

    async execute(interaction) {
        const index = interaction.options.getInteger('index');

        if (index < 0 || index >= queue.length) {
            return interaction.reply("❌ Index de chanson invalide.");
        }

        // Passer à la chanson spécifiée
        const songToPlay = queue[index];
        queue = queue.slice(index);  // Met à jour la file d'attente

        // Jouer la chanson spécifiée (fonction hypothétique `playMusic`)
        playMusic(songToPlay);

        return interaction.reply(`✅ Le bot passe à la chanson n°${index + 1} : ${songToPlay}.`);
    }
};

// Hypothétique fonction pour jouer une chanson
function playMusic(song) {
    console.log(`Joue la chanson : ${song}`);
    // Code pour jouer la musique ici
}