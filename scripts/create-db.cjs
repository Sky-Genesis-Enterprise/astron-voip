const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
require('dotenv').config();
const path = require('path');

async function runRemoteCommands() {
  const {
    VM_IP,
    VM_USER,
    VM_MDP,
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
  } = process.env;

  try {
    console.log(`🔌 Connexion SSH à ${VM_USER}@${VM_IP}...`);
    await ssh.connect({
      host: VM_IP,
      username: VM_USER,
      password: VM_MDP,
    });
    console.log('✅ Connecté au serveur distant.');

    console.log('🚀 Mise à jour et installation de PostgreSQL...');
    await ssh.execCommand('sudo apt update && sudo apt install -y postgresql postgresql-contrib');

    console.log('🛠️ Démarrage et activation du service PostgreSQL...');
    await ssh.execCommand('sudo systemctl start postgresql');
    await ssh.execCommand('sudo systemctl enable postgresql');

    console.log('🔐 Configuration du mot de passe pour l’utilisateur "postgres"...');
    await ssh.execCommand(`sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD '${DB_PASSWORD}';"`);

    // Vérifier si l’utilisateur DB_USER existe (en se connectant avec superuser)
    const checkUserCmd = `sudo -u postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='${DB_USER}'"`;
    const userExistsResult = await ssh.execCommand(checkUserCmd);
    const userExists = userExistsResult.stdout.trim() === '1';

    if (!userExists) {
      console.log(`Création de l’utilisateur ${DB_USER}...`);
      await ssh.execCommand(`sudo -u postgres psql -c "CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASSWORD}';"`);
    } else {
      console.log(`Utilisateur ${DB_USER} existe déjà.`);
    }

    // Vérifier si la base DB_NAME existe
    const checkDbCmd = `sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'"`;
    const dbExistsResult = await ssh.execCommand(checkDbCmd);
    const dbExists = dbExistsResult.stdout.trim() === '1';

    if (!dbExists) {
      console.log(`Création de la base de données ${DB_NAME}...`);
      await ssh.execCommand(`sudo -u postgres psql -c "CREATE DATABASE \\"${DB_NAME}\\" OWNER ${DB_USER};"`);
    } else {
      console.log(`Base de données ${DB_NAME} existe déjà.`);
    }

    // Transférer le fichier schema.sql
    const localSchemaPath = path.resolve(__dirname, '../data/database.sql');
    const remoteSchemaPath = `/tmp/database.sql`;
    await ssh.putFile(localSchemaPath, remoteSchemaPath);
    console.log('📄 Fichier schema.sql transféré sur le serveur.');

    // Appliquer le schéma SQL en se connectant avec l’utilisateur DB_USER
    console.log(`📑 Application du schéma SQL dans la base ${DB_NAME}...`);
    const applySchemaCmd = `psql -U ${DB_USER} -d "${DB_NAME}" -f ${remoteSchemaPath}`;
    // On lance la commande via sudo -u postgres pour garantir les droits, 
    // mais on utilise DB_USER en -U, donc il faut que ce user existe bien avec droits
    const applyResult = await ssh.execCommand(
      `sudo -u postgres bash -c "${applySchemaCmd}"`
    );

    if (applyResult.stderr) {
      console.error('❌ Erreur lors de l’application du schéma :', applyResult.stderr);
      process.exit(1);
    }

    console.log('✅ Schéma appliqué avec succès.');

    ssh.dispose();
    console.log('🎉 Script terminé avec succès !');
  } catch (err) {
    console.error('❌ Erreur SSH ou PostgreSQL:', err);
    process.exit(1);
  }
}

runRemoteCommands();