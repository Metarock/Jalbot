const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'volume',
    aliases: ['v'],
    category: "Music",
    description: 'Set the volume level of the music',
    args: true,
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
            let response = new MessageEmbed()
                .setColor("RED")
                .setDescription("Ming mong, there is no music playing.");
            return message.channel.send({ embeds: [response] });
        }

        const emojivolume = message.client.emoji.volumehigh;

        if (!args.length) {
            response = new MessageEmbed()
                .setColor(message.client.embedColor)
                .setTimestamp()
                .setDescription(`${emojivolume} The player volume \`${player.volume}\``)
            return message.channel.send({ embeds: [response] });
        }

        if (!channel) {
            response = new MessageEmbed()
                .setColor("RED")
                .setTimestamp()
                .setDescription(`you need to join a voice channel good human`)
            return message.channel.send({ embeds: [response] });
        }
        if (channel.id !== player.voiceChannel) {
            response = new MessageEmbed()
                .setColor("RED")
                .setTimestamp()
                .setDescription("you are not in the same voice channel as the Jalbot.")
            return message.channel.send({ embeds: [response] });
        }

        //if user input is not a Number, then output an error
        if (isNaN(args[0])) {
            response = new MessageEmbed()
                .setColor("RED")
                .setTimestamp()
                .setDescription("You need to input a number")
            return message.channel.send({ embeds: [response] });
        }

        const volume = Number(args[0]);

        if (!volume || volume < 1 || volume > 100) {
            response = new MessageEmbed()
                .setColor("RED")
                .setTimestamp()
                .setDescription("I request you to give me a volume between 1 and 100")
            return message.channel.send({ embeds: [response] });
        }

        player.setVolume(volume);
        response = new MessageEmbed()
            .setColor(message.client.embedColor)
            .setTimestamp()
            .setDescription(`${emojivolume} The player volume \`${player.volume}\``)
        return message.channel.send({ embeds: [response] });
    }
}