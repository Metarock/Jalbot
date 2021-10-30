const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "loop",
    aliases: ["repeat", "lp"],
    category: "Music",
    description: "Loop the current track",
    args: false,
    usage: "",
    permission: [],
    owner: false,
    player: true,
    inVoiceChannel: false,
    sameVoiceChannel: false,
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
                .setDescription("There is no music playing.");
            return message.channel.send({ embeds: [response] });
        }

        const emojiloop = message.client.emoji.loop;

        if (args.length && /queue/i.test(args[0])) {
            player.setQueueRepeat(!player.queueRepeat);
            const queueRepeat = player.queueRepeat ? "enabled" : "disabled";

            response = new MessageEmbed()
                .setColor(message.client.embedColor)
                .setTimestamp()
                .setDescription(`${emojiloop} Loop queue is now **${queueRepeat}**`)
        }

        player.setTrackRepeat(!player.trackRepeat);
        const trackRepeat = player.trackRepeat ? "enabled" : "disabled";

        response = new MessageEmbed()
            .setColor(message.client.embedColor)
            .setTimestamp()
            .setDescription(`${emojiloop} Loop track is now **${trackRepeat}**`)
        return message.channel.send({ embeds: [response] })

    }

}