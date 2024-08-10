const { Client, GatewayIntentBits, PermissionsBitField, AttachmentBuilder, ChannelType } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Read configuration from JSON file
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const TOKEN = config.token;
const CHALLENGE_ROLE_NAME = config.challengeRoleName;
const QUESTION = config.question;

client.once('ready', () => {
  console.log('Bot is ready!');
});

client.on('guildMemberAdd', async (member) => {
  const guild = member.guild;
  const challengeRole = guild.roles.cache.find(role => role.name === CHALLENGE_ROLE_NAME);

  if (!challengeRole) {
    console.error(`Challenge role "${CHALLENGE_ROLE_NAME}" not found!`);
    return;
  }

  // Create a new channel for the user
  const channel = await guild.channels.create({
    name: `challenge-${member.user.username}`,
    type: ChannelType.GuildText,
    permissionOverwrites: [
      {
        id: guild.id,
        deny: [PermissionsBitField.Flags.ViewChannel],
      },
      {
        id: member.id,
        allow: [PermissionsBitField.Flags.ViewChannel],
      },
      {
        id: challengeRole.id,
        allow: [PermissionsBitField.Flags.ViewChannel],
      },
    ],
  });

  // Send the challenge question and image
  await channel.send({
    content: `Welcome ${member}! Here's your challenge:\n\n${QUESTION}`,
  });
});

client.login(TOKEN);