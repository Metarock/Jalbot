const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'clearqueue',
    aliases: ['cq'],
    catergory: "Music",
    description: "Clear the entire track or queue",
    args: false,
    usage: "<Number of songs in the queue>",
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


        if (!player.queue.current) {
            let response = new MessageEmbed()
                .setColor("RED")
                .setDescription("Ming mong, there is no music playing.");
            return message.channel.send({ embeds: [response] });
        }


        try {
            //clear the entire queue
            player.queue.clear();

            const emojieject = message.client.emoji.remove;


            return message.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(client.embedColor)
                    .setTimestamp()
                    .setDescription(`${emojieject}Jalbot has cleared all the tracks in the queue`)
                ]
            })
        } catch (error) {
            return message.channel.send({
                embeds: [new MessageEmbed()
                    .setColor("RED")
                    .setDescription(`There was an error clearing the queue\n [ERROR MESSAGE]: ${error}`)]
            })
        }

    }
}