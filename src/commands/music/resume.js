const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "resume",
    aliases: ["rs", "r"],
    category: "Music",
    description: "Resumes the music that was paused",
    args: false,
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

        const emojiresume = message.client.emoji.resume;

        if (!player.paused) {
            response = new MessageEmbed()
                .setColor("RED")
                .setDescription(`${emojiresume} Ming mong, the player is already resumed`)
            return message.channel.send({ embeds: [response] });
        }

        //resume the player
        player.pause(false)
        response = new MessageEmbed()
            .setDescription(`${emojiresume} **Resuming**\n[${player.queue.current.title}](${player.queue.current.uri})`)
            .setColor(message.client.embedColor)
            .setTimestamp()
        return message.channel.send({ embeds: [response] })
    }
}