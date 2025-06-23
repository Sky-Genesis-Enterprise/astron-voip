const {SlashCommandBuilder} = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause-all')
        .setDescription('Met en pause la musique dans tous les salons vocaux.'),

    async execute(interaction) {
        // Récupérer tous les salons vocaux du serveur
        const guild = interaction.guild;
        guild.voiceStates.cache.forEach(state => {
            if (state.channel) {
                const voiceChannel = state.channel;
                if (voiceChannel.members.has(interaction.client.user.id)) {
                    // Le bot est présent dans ce salon vocal, on met en pause la musique
                    const connection = getVoiceConnection(voiceChannel.guild.id);
                    if (connection) {
                        connection.state.subscription.player.pause();
                        console.log(`La musique a été mise en pause dans le salon vocal : ${voiceChannel.name}`);
                    }
                }
            }
        });

        return interaction.reply("✅ La musique a été mise en pause dans tous les salons vocaux.");
    }
};