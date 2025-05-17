require('dotenv').config();
const express = require('express');
const app = express();

app.get('/', (_, res) => res.send('Bot activo — ' + new Date().toISOString()));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🌐 Keep‑alive escuchando en ${PORT}`));

const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});
client.on('voiceStateUpdate', async (oldState, newState) => {
  const member = newState.member;

  // Rol que se asignará
  const roleId = '1373359686073585735'; // <- cambia esto por el ID del rol que quieres asignar

  // Si entra a una llamada
  if (!oldState.channel && newState.channel) {
    try {
      await member.roles.add(roleId);
      console.log(`✅ Rol agregado a ${member.user.tag}`);
    } catch (error) {
      console.error(`Error al agregar el rol:`, error);
    }
  }

  // Si sale de la llamada
  if (oldState.channel && !newState.channel) {
    try {
      await member.roles.remove(roleId);
      console.log(`❌ Rol removido a ${member.user.tag}`);
    } catch (error) {
      console.error(`Error al remover el rol:`, error);
    }
  }
});

client.once('ready', () => {
    console.log(`✅ Bot conectado como ${client.user.tag}`);
});

client.on('messageCreate', message => {
    if (message.content === '!ping') {
        message.reply('🏓 ¡Pong!');
    }
});

client.login(process.env.DISCORD_TOKEN);