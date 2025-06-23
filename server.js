// server.js
import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import { startPresenceCycle } from "./utils/statusManager.js";

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildScheduledEvents,
  ],
});

client.once("ready", () => {
  console.log(`✅ Le bot est connecté en tant que ${client.user.tag}`);
  startPresenceCycle(client);
});

client.login(process.env.BOT_TOKEN);