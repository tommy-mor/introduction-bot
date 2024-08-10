const { Client, GatewayIntentBits, Permissions, MessageAttachment } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const TOKEN = 'YOUR_BOT_TOKEN_HERE';
const CHALLENGE_ROLE_NAME = 'srelg';
const QUESTION = 'What do you think about pineapple on pizza?';
const IMAGE_PATH = path.join(__dirname, 'challenge_image.png'); // Make sure to have this image in your bot's directory

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
    type: 'text',
    permissionOverwrites: [
      {
        id: guild.id,
        deny: [Permissions.FLAGS.VIEW_CHANNEL],
      },
      {
        id: member.id,
        allow: [Permissions.FLAGS.VIEW_CHANNEL],
      },
      {
        id: challengeRole.id,
        allow: [Permissions.FLAGS.VIEW_CHANNEL],
      },
    ],
  });

  // Send the challenge question and image
  const attachment = new MessageAttachment(IMAGE_PATH);
  await channel.send({
    content: `Welcome ${member}! Here's your challenge:\n\n${QUESTION}`,
    files: [attachment],
  });
});

client.login(TOKEN);
