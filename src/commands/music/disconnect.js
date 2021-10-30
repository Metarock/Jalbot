const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "disconnect",
    aliases: ["dc", "fuckoff"],
    category: "Music",
    description: "Disconnect from voice channel",
    args: false,
    usage: "",
    permission: [],
    owner: false,
    player: true,
    inVoiceChannel: true,
    sameVoiceChannel: true,
    execute: async (message, args, client, prefix) => {
        const player = client.manager.get(message.guild.id);

        if (!player) {
            let response = new MessageEmbed()
                .setColor("RED")
                .setDescription("Ming mong, there is no player in this guild");
            return message.channel.send({ embeds: [response] });
        }

        const { channel } = message.member.voice;
        if (!channel) {
            let response = new MessageEmbed()
                .setColor("RED")
                .setDescription("You need to join a channel first good human");
            return message.channel.send({ embeds: [response] });
        }
        if (channel.id !== player.voiceChannel) {
            let response = new MessageEmbed()
                .setColor("RED")
                .setDescription("Ming mong, you are not in the same voice channel as me");
            return message.channel.send({ embeds: [response] });
        }

        const emojiLeave = message.client.emoji.leave;

        player.destroy();

        let response = new MessageEmbed()
            .setColor(message.client.embedColor)
            .setDescription(`${emojiLeave} **Left the voice channel**\nThank you for using ${message.client.user.username}!`)
        return message.channel.send({ embeds: [response] });
    }

}