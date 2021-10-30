const { MessageEmbed } = require('discord.js');
const pre = require("../../schema/prefix.js");

module.exports = async (client, message) => {

    if (message.author.bot) return;
    if (!message.guild) return;
    //check if there is a custom prefix set in this server
    let prefix = client.prefix;
    const ress = await pre.findOne({ guildid: message.guild.id })
    if (ress && ress.prefix) prefix = ress.prefix;

    const mention = new RegExp(`^<@!?${client.user.id}>( |)$`);

    if (message.content.match(mention)) {
        const response = new MessageEmbed()
            .setColor(client.embedColor)
            .setDescription(`**› My prefix in this server is \`${prefix}\`**\n**› You can see my all commands type \`${prefix}\`help**`);
        message.channel.send({ embeds: [response] })
    };

    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
    if (!prefixRegex.test(message.content)) return;

    const [matchedPrefix] = message.content.match(prefixRegex);

    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    const response = new MessageEmbed()
        .setColor("RED");

    if (command.args && !args.length) {
        let reply = `You did not provide any arguments to me Ming mong, ${message.author}!`;

        // usage: '',
        if (command.usage) {
            reply += `\nUsage: \`${prefix}${command.name} ${command.usage}\``;
        }

        response.setDescription(reply);
        return message.channel.send({ embeds: [response] });
    }

    if (command.permission && !message.member.permissions.has(command.permission)) {
        response.setDescription("Ming mong do not have the permission to use this command");
        return message.channel.send({ embeds: [response] });
    }

    if (command.owner && message.author.id !== `${client.owner}`) {
        response.setDescription("Only <@491577179495333903> can use this command!");
        return message.channel.send({ embeds: [response] });
    }

    const player = message.client.manager.get(message.guild.id);

    if (command.player && !player) {
        response.setDescription("There is no player for this guild.");
        return message.channel.send({ embeds: [response] });
    }

    if (command.inVoiceChannel && !message.member.voice.channel) {
        response.setDescription("You must be in a voice channel first, hayzz");
        return message.channel.send({ embeds: [response] });
    }

    if (command.sameVoiceChannel && message.member.voice.channel !== message.guild.me.voice.channel) {
        response.setDescription(`You must be in the same channel as ${message.client.user}!`);
        return message.channel.send({ embeds: [response] });
    }

    try {
        command.execute(message, args, client, prefix);
    } catch (error) {
        console.log(error);
        response.setDescription("There was an error executing that command.\nI have contacted the owner of the bot to fix it immediately.");
        return message.channel.send({ embeds: [response] });
    }
}