const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "remove",
    aliases: ["rm"],
    category: "Music",
    description: "remove song from the queue",
    args: true,
    usage: "<Number of song in queue>",
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
            let thing = new MessageEmbed()
                .setColor("RED")
                .setDescription("Ming mong, there is no music playing.");
            return message.channel.send({ embeds: [thing] });
        }


        const position = (Number(args[0]) - 1);
        if (position > player.queue.size) {
            const number = (position + 1);
            let thing = new MessageEmbed()
                .setColor("RED")
                .setDescription(`No songs at number ${number}.\nTotal Songs: ${player.queue.size}`);
            return message.channel.send({ embeds: [thing] });
        }

        const song = player.queue[position]
        player.queue.remove(position);

        const emojieject = message.client.emoji.remove;

        let thing = new MessageEmbed()
            .setColor(message.client.embedColor)
            .setTimestamp()
            .setDescription(`${emojieject} Removed\n[${song.title}](${song.uri})`)
        return message.channel.send({ embeds: [thing] });
    }
}