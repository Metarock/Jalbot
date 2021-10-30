const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "join",
    aliases: ["j"],
    category: "Music",
    description: "Join voice channel",
    args: false,
    usage: "",
    permission: [],
    owner: false,
    player: false,
    inVoiceChannel: true,
    sameVoiceChannel: false,
    execute: async (message, args, client, prefix) => {
        const { channel } = message.member.voice;

        const emojiJoin = message.client.emoji.join;

        let response;

        if (!message.guild.me.voice.channel) {
            const player = message.client.manager.create({
                guild: message.guild.id,
                voiceChannel: channel.id,
                textChannel: message.channel.id,
            })

            player.connect();

            response = new MessageEmbed()
                .setColor(client.embedColor)
                .setDescription(`${emojiJoin} **Joined the voice channel**\nJoined <#${channel.id}> and bound to <#${message.channel.id}>`)
            return message.channel.send({ embeds: [response] });
        } else if (message.guild.me.voice.channel !== channel) {
            response = new MessageEmbed()
                .setColor("RED")
                .setDescription(`Ming ming, you must be in the same channel as ${message.client.user}`)
            return message.channel.send({ embeds: [response] });
        }
    }
}