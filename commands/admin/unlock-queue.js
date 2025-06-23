const {SlashCommandBuilder} = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unlock-queue')
        .setDescription('Déverrouille la file d\'attente musicale et permet d\'ajouter de nouvelles chansons.'),

    async execute(interaction) {
        // Vérifie si la queue est déjà déverrouillée
        if (!isQueueLocked) {
            return interaction.reply("❌ La file d'attente musicale est déjà déverrouillée.");
        }

        // Déverrouiller la queue
        isQueueLocked = false;

        return interaction.reply("✅ La file d'attente musicale est maintenant déverrouillée. Vous pouvez ajouter de nouvelles chansons.");
    }
};