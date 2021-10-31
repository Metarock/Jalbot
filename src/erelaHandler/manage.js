require('dotenv').config();
const mongoose = require('mongoose');
const { Client } = require('discord.js');
const { Manager } = require('erela.js');
const Spotify = require('erela.js-spotify');
const Deezer = require('erela.js-deezer');
const { readdirSync } = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = async (client) => {

    client.manager = new Manager({
        //plugins here such as Spotify, Soundcloud
        plugins: [
            new Spotify({
                clientID: process.env.clientID_SPOTIFY,
                clientSecret: process.env.clientSecret
            }),
            new Deezer()
        ],
        // Pass an array of node. Note: You do not need to pass any if you are using the default values (ones shown below).
        nodes: [
            // If you pass a object like so the "host" property is required
            {
                host: process.env.lavalink_host, // Optional if Lavalink is local
                port: parseInt(process.env.lavalink_port), // Optional if Lavalink is set to default
                password: process.env.lavalink_password, // Optional if Lavalink is set to default
            },
        ],
        // A send method to send data to the Discord WebSocket using your library.
        // Getting the shard for the guild and sending the data to the WebSocket.
        send(id, payload) {
            const guild = client.guilds.cache.get(id);
            if (guild) guild.shard.send(payload);
        },
    })

    // Here we send voice data to lavalink whenever the bot joins a voice channel to play audio in the channel.
    client.on("raw", (d) => client.manager.updateVoiceState(d));

    /**
 * Mongodb connection
 */

    const dbOptions = {
        useNewUrlParser: true,
        autoIndex: false,
        connectTimeoutMS: 10000,
        family: 4,
        useUnifiedTopology: true,
    };
    mongoose.connect(process.env.mongourl, dbOptions);
    mongoose.Promise = global.Promise;
    mongoose.connection.on('connected', () => {
        client.logger.log('[DB] DATABASE CONNECTED', "ready");
    });
    mongoose.connection.on('err', (err) => {
        console.log(`Mongoose connection error: \n ${err.stack}`, "error");
    });
    mongoose.connection.on('disconnected', () => {
        console.log('Mongoose disconnected');
    });

    //Error handling
    client.on("disconnect", () => console.log("Bot is disconnecting..."))
    client.on("reconnecting", () => console.log("Bot reconnecting..."))
    client.on('warn', error => console.log(error));
    client.on('error', error => console.log(error));
    process.on('unhandledRejection', error => console.log(error));
    process.on('uncaughtException', error => console.log(error));


    /**
* Client Events
*/
    readdirSync("./src/events/client/").forEach(file => {
        const event = require(`../events/client/${file}`);
        let eventName = file.split(".")[0];
        client.logger.log(`Loading Events Client ${eventName}`, "event");
        client.on(eventName, event.bind(null, client));
    });

    /**
     * Erela Manager Events
     */
    readdirSync("./src/events/lavalink/").forEach(file => {
        const event = require(`../events/lavalink/${file}`);
        let eventName = file.split(".")[0];
        client.logger.log(`Loading Events Lavalink ${eventName}`, "event");
        client.manager.on(eventName, event.bind(null, client));
    });

    /**
 * Import all commands
 */
    readdirSync("./src/commands/").forEach(dir => {
        const commandFiles = readdirSync(`./src/commands/${dir}/`).filter(f => f.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`../commands/${dir}/${file}`);
            client.logger.log(`Loading ${command.category} commands ${command.name}`, "cmd");
            client.commands.set(command.name, command);
        }
    })

    //TODO: IMPORT THE SLASH COMMANDS LATER
    const data = [];

    readdirSync("./src/slashCommands/").forEach((dir) => {
        const slashCommandFile = readdirSync(`./src/slashCommands/${dir}/`).filter((files) => files.endsWith(".js"));

        for (const file of slashCommandFile) {
            const slashCommand = require(`../slashCommands/${dir}/${file}`)

            if (!slashCommand.name) return console.log(`slashCommandNameError: ${slashCommand.split(".")[0]} application command name is required`)

            if (!slashCommand.description) return console.error(`slashCommandDescriptionError: ${slashCommand.split(".")[0]} application command description is required.`);

            client.slashCommands.set(slashCommand.name, slashCommand);
            client.logger.log(`Client SlashCommands Command (/) Loaded: ${slashCommand.name}`, "cmd");
            data.push(slashCommand);

        }
    })


    client.on("ready", async () => {
        await client.application.commands.set(data).then(() => client.logger.log(`Client SlashCommand (/) Registered.`, "ready")).catch((e) => console.log(e));
    });
}