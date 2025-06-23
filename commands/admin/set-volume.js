const {SlashCommandBuilder} = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-volume')
        .setDescription('Réglez le volume de la musique en cours.')
        .addIntegerOption(option => 
            option.setName('volume')
                .setDescription('Le volume souhaité entre 0 et 100.')
                .setRequired(true)
                .setMinValue(0)
                .setMaxValue(100)),

    async execute(interaction) {
        const volume = interaction.options.getInteger('volume');

        // Vérifie si le bot est connecté à un salon vocal
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            return interaction.reply("❌ Vous devez être dans un salon vocal pour utiliser cette commande.");
        }

        const connection = getVoiceConnection(voiceChannel.guild.id);
        if (!connection) {
            return interaction.reply("❌ Le bot n'est pas connecté à un salon vocal.");
        }

        // Appliquer le volume
        const player = connection.state.subscription.player;
        player.setVolume(volume / 100);  // On met le volume entre 0 et 1
        console.log(`Le volume a été réglé à ${volume}%`);

        return interaction.reply(`✅ Le volume a été réglé à ${volume}%.`);
    }
};