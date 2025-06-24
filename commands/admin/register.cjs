const { SlashCommandBuilder, ChannelType } = require('discord.js');
require('dotenv').config();
const { Pool } = require('pg');

// Connexion PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: false
});

// Génération numéro VoIP
const generateVoipNumber = () => {
  const prefix = process.env.VOIP_NUMBER_PREFIX || '77';
  const a = Math.floor(1000 + Math.random() * 9000);
  const b = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${a}${b}`;
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('register')
    .setDescription('Initialise votre serveur pour Astron VoIP')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Salon vocal pour les appels')
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildVoice))
    .addRoleOption(option =>
      option.setName('role')
        .setDescription('Rôle autorisé à répondre aux appels')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('name')
        .setDescription('Nom personnalisé du standard (facultatif)')
        .setRequired(false)),

  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    const role = interaction.options.getRole('role');
    const customName = interaction.options.getString('name') || interaction.guild.name;

    const guildId = interaction.guild.id;

    try {
      const check = await pool.query(
        'SELECT * FROM servers WHERE guild_id = $1',
        [guildId]
      );

      if (check.rows.length > 0) {
        return interaction.reply({
          content: `⚠️ Ce serveur est déjà enregistré avec le numéro : \`${check.rows[0].voip_number}\``,
          ephemeral: true
        });
      }

      const voipNumber = generateVoipNumber();

      await pool.query(`
        INSERT INTO servers (guild_id, voip_number, default_channel_id, authorized_role_id, custom_name)
        VALUES ($1, $2, $3, $4, $5)
      `, [guildId, voipNumber, channel.id, role.id, customName]);

      await interaction.reply({
        content: `✅ Serveur enregistré avec succès !
        
📞 Numéro VoIP : \`${voipNumber}\`
🏷️ Nom : **${customName}**
🎙️ Salon vocal : <#${channel.id}>
🔐 Rôle autorisé : <@&${role.id}>`,
        ephemeral: true
      });

    } catch (err) {
      console.error('Erreur dans /register:', err);
      await interaction.reply({
        content: `❌ Une erreur est survenue pendant l'enregistrement.`,
        ephemeral: true
      });
    }
  }
};