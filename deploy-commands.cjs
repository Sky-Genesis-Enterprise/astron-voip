// deploy-commands.cjs
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

const commands = [];

// Récupération des chemins
const commandsPath = path.join(__dirname, 'commands');
const folders = fs.readdirSync(commandsPath);

for (const folder of folders) {
  const folderPath = path.join(commandsPath, folder);
  const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const command = require(path.join(folderPath, file));
    if (command.data && command.data.name) {
      commands.push(command.data.toJSON());
    } else {
      console.warn(`⚠️ Le fichier ${file} ne contient pas de commande valide.`);
    }
  }
}

// Initialiser REST
const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);

// Déploiement
(async () => {
  try {
    console.log('🚀 Déploiement des commandes slash...');

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );

    console.log('✅ Commandes déployées avec succès.');
  } catch (error) {
    console.error('❌ Erreur lors du déploiement :', error);
  }
})();