const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "loopqueue",
    aliases: ['lq', 'repeatqueue'],
    category: "Music",
    description: "Loop through the entire queue",
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
                .setDescription("There is no music playing.");
            return message.channel.send({ embeds: [response] });
        }

        const emojiloop = message.client.emoji.loop;

        //if trackrepeat was active add information message  + disable it
        if (player.trackRepeat) {
            player.setTrackRepeat(false);
            response = new MessageEmbed()
                .setColor("RED")
                .setDescription(`Detected a song on repeat, dw Jalbot disabled it :)\n Jalbot changed queue loop to: **${player.queueRepeat ? 'disabled' : 'enabled'}**`);

            return message.channel.send({ embeds: [response] })
        }

        //change queue mode
        player.setQueueRepeat(!player.queueRepeat);

        response = new MessageEmbed()
            .setColor(message.client.embedColor)
            .setTimestamp()
            .setDescription(`${emojiloop} Loop queue is now **${player.queueRepeat ? 'disabled' : 'enabled'}**`)

        return message.channel.send({ embeds: [response] })
    }
}