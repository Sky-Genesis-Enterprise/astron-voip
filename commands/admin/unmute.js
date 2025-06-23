const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('🔊 Réactive le micro d’un utilisateur dans un salon vocal.')
        .addUserOption(option =>
            option.setName('membre')
                .setDescription('Le membre à unmute')
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
            await member.voice.setMute(false, "Démuté par un modérateur");
            interaction.reply({ content: `🔊 **${member.user.tag}** a été démuté dans le salon vocal.` });
        } catch (error) {
            console.error(error);
            interaction.reply({ content: "❌ Impossible de unmute ce membre.", ephemeral: true });
        }
    }
};