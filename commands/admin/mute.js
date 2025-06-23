const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('🔇 Coupe le micro d’un utilisateur dans un salon vocal.')
        .addUserOption(option =>
            option.setName('membre')
                .setDescription('Le membre à mute')
                .setRequired(true)
        ),

    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return interaction.reply({ content: "❌ Vous n’avez pas la permission d’exécuter cette commande.", ephemeral: true });
        }

        const member = interaction.options.getMember('membre');

        if (!member) {
            return interaction.reply({ content: "❌ Utilisateur introuvable.", ephemeral: true });
        }

        if (!member.voice.channel) {
            return interaction.reply({ content: "❌ Ce membre n'est pas dans un salon vocal.", ephemeral: true });
        }

        try {
            await member.voice.setMute(true, "Muté par un modérateur");
            interaction.reply({ content: `🔇 **${member.user.tag}** a été muté dans le salon vocal.` });
        } catch (error) {
            console.error(error);
            interaction.reply({ content: "❌ Impossible de mute ce membre.", ephemeral: true });
        }
    }
};