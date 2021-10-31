require('dotenv').config();
const { Client, Intents, Collection } = require('discord.js');
const { readdirSync } = require("fs");
const client = new Client({
	//fetchAllMembers: false,
	//restTimeOffset: 0,
	//restWsBridgetimeout: 100,
	shards: "auto",
	allowedMentions: {
		parse: ["everyone", "roles", "users"],
		repliedUser: false,
	},
	partials: ["CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION", "USER"],
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_INVITES,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_VOICE_STATES
	],
	presence: {
		activity: {
			name: `Music`,
			type: "LISTENING",
		},
		status: "online"
	}
});

//24/7 online in the web
const express = require('express');
const app = express();
const port = 3000 || 8000 || 5500;

app.get('/', (req, res) => {
	res.send('Jalbot is online');
})

module.exports = client;
// Initiate the Manager with some options and listen to some events.
client.commands = new Collection();
//Add slashcommands here
client.slashCommands = new Collection();
client.owner = process.env.ownerID;
client.prefix = process.env.prefix;
client.embedColor = process.env.embedColor;
client.aliases = new Collection();
client.categories = readdirSync('./src/commands/')
client.logger = require("./utils/logger.js");
client.emoji = require("./utils/emoji.json");
require('./erelaHandler/manage')(client);

client.login(process.env.token)