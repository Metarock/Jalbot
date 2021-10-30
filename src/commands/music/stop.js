const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'stop',
    category: "Music",
    description: "Stops the music",
    args: false,
    usage: "",
    permission: [],
    owner: false,
    player: true,
    inVoiceChannel: true,
    sameVoiceChannel: true,
    execute: async (message, args, client, prefix) => {
        const player = client.manager.get(message.guild.id);
        let response;
        if (!player) {
            response = new MessageEmbed()
                .setColor("RED")
                .setDescription("Ming mong, there is no player in this guild");
            return message.channel.send({ embeds: [response] });
        }

        const { channel } = message.member.voice;
        if (!channel) {
            response = new MessageEmbed()
                .setColor("RED")
                .setDescription("You need to join a channel first good human");
            return message.channel.send({ embeds: [response] });
        }
        if (channel.id !== player.voiceChannel) {
            response = new MessageEmbed()
                .setColor("RED")
                .setDescription("Ming mong, you are not in the same voice channel as me");
            return message.channel.send({ embeds: [response] });
        }

        if (!player.queue.current) {
            response = new MessageEmbed()
                .setColor("RED")
                .setDescription("Ming mong, there is no music playing.");
            return message.channel.send({ embeds: [response] });
        }

        player.stop()
        player.queue.clear()

        const emojistop = message.client.emoji.stop;

        response = new MessageEmbed()
            .setColor(message.client.embedColor)
            .setTimestamp()
            .setDescription(`${emojistop} Stopped the music`);
        return message.channel.send({ embeds: [response] });
    }
}