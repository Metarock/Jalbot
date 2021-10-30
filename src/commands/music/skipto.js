const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "skipto",
    aliases: ["jump", "st", "next"],
    description: "Skip to a specific track",
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
            response = new MessageEmbed()
                .setColor("RED")
                .setDescription("Ming mong, there is no music playing.");
            return message.channel.send({ embeds: [response] });
        }

        const emojijump = message.client.emoji.jump;

        try {
            //if there are no args send error plus example
            if (!args[0]) {
                return message.channel.send({
                    embeds: [new MessageEmbed()
                        .setDescription(`Please include which track you want to jump. Example: \'?skipto ${player.queue.size - 2 <= 0 ? player.queue.size : player.queue.size - 2}\'`)
                        .setColor(message.client.embedColor)
                        .setTimestamp()
                    ]
                })
            }

            //if user input is not a Number
            if (isNaN(args[0])) {
                return message.channel.send({
                    embeds: [new MessageEmbed()
                        .setDescription(`You need to input a number`)
                        .setColor(message.client.embedColor)
                        .setTimestamp()
                    ]
                })
            }

            //if wish track is bigger than the size
            if (Number(args[0]) > player.queue.size) {
                return message.channel.send({
                    embeds: [new MessageEmbed()
                        .setDescription(`That song is not in the queue, sorry.....`)
                        .setColor(message.client.embedColor)
                        .setTimestamp()
                    ]
                })
            }

            //remove all tracks to the jumped song
            player.queue.remove(0, Number(args[0]) - 1);

            //stop the player
            player.stop()
            return message.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription(`${emojijump}Jumped to the: ${Number(args[0])}`)
                    .setColor(message.client.embedColor)
                    .setTimestamp()
                ]
            })
        } catch (error) {

        }
    }
}