const {SlashCommandBuilder} = require('discord.js')

let isQueueLocked = false;  // Variable pour suivre l'état du verrouillage de la queue

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lock-queue')
        .setDescription('Verrouille ou déverrouille la file d\'attente musicale.'),

    async execute(interaction) {
        // Alterner l'état de verrouillage de la queue
        isQueueLocked = !isQueueLocked;

        if (isQueueLocked) {
            return interaction.reply("✅ La file d'attente musicale est maintenant verrouillée. Aucune nouvelle chanson ne peut être ajoutée.");
        } else {
            return interaction.reply("✅ La file d'attente musicale est maintenant déverrouillée. Vous pouvez ajouter de nouvelles chansons.");
        }
    }
};
