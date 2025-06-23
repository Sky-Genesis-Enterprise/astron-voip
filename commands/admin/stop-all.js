const {SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop-all')
        .setDescription('Arrête la musique dans tous les salons vocaux.'),

    async execute(interaction) {
        // Récupérer tous les salons vocaux du serveur
        const guild = interaction.guild;
        guild.voiceStates.cache.forEach(state => {
            if (state.channel) {
                const voiceChannel = state.channel;
                if (voiceChannel.members.has(interaction.client.user.id)) {
                    // Le bot est présent dans ce salon vocal, donc on le fait quitter
                    voiceChannel.leave();
                    console.log(`Le bot a quitté le salon vocal : ${voiceChannel.name}`);
                }
            }
        });
        return interaction.reply("✅ La musique a été arrêtée dans tous les salons vocaux.");
    }
};
