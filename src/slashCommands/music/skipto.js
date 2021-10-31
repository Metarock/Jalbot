const { CommandInteraction, Client, MessageEmbed } = require("discord.js");

module.exports = {
    name: "skipto",
    description: "Forward song",
    owner: false,
    player: true,
    inVoiceChannel: true,
    sameVoiceChannel: true,
    options: [
        {
            name: "number",
            description: "select a song number",
            required: true,
            type: "NUMBER"
        }
    ],

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */

    run: async (client, interaction, prefix) => {
        await interaction.deferReply({
            ephemeral: false
        });
        const args = interaction.options.getNumber("number");
        const player = interaction.client.manager.get(interaction.guildId);

        let response;
        if (!player) {
            response = new MessageEmbed()
                .setColor("RED")
                .setDescription("Ming mong, there is no player in this guild");
            return await interaction.editReply({ embeds: [response] });
        }

        const { channel } = interaction.member.voice;
        if (!channel) {
            response = new MessageEmbed()
                .setColor("RED")
                .setDescription("You need to join a channel first good human");
            return await interaction.editReply({ embeds: [response] });
        }
        if (channel.id !== player.voiceChannel) {
            response = new MessageEmbed()
                .setColor("RED")
                .setDescription("Ming mong, you are not in the same voice channel as me");
            return await interaction.editReply({ embeds: [response] });
        }

        if (!player.queue.current) {
            response = new MessageEmbed()
                .setColor("RED")
                .setDescription("Ming mong, there is no music playing.");
            return await interaction.editReply({ embeds: [response] });
        }

        const emojijump = client.emoji.jump;

        try {
            //if there are no args send error plus example
            if (!args) {
                return await interaction.editReply({
                    embeds: [new MessageEmbed()
                        .setDescription(`Please include which track you want to jump. Example: \'?skipto ${player.queue.size - 2 <= 0 ? player.queue.size : player.queue.size - 2}\'`)
                        .setColor(client.embedColor)
                        .setTimestamp()
                    ]
                })
            }

            //if user input is not a Number
            if (isNaN(args)) {
                return message.channel.send({
                    embeds: [new MessageEmbed()
                        .setDescription(`You need to input a number`)
                        .setColor(message.client.embedColor)
                        .setTimestamp()
                    ]
                })
            }

            //if wish track is bigger than the size
            if (Number(args) > player.queue.size) {
                return message.channel.send({
                    embeds: [new MessageEmbed()
                        .setDescription(`That song is not in the queue, sorry.....`)
                        .setColor(message.client.embedColor)
                        .setTimestamp()
                    ]
                })
            }

            //remove all tracks to the jumped song
            player.queue.remove(0, Number(args) - 1);

            //stop the player
            player.stop()
            return message.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription(`${emojijump}Jumped to the: ${Number(args)}`)
                    .setColor(message.client.embedColor)
                    .setTimestamp()
                ]
            })
        } catch (error) {
            return message.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription(`Error in skipping to a track `, error)
                    .setColor(message.client.embedColor)
                    .setTimestamp()
                ]
            })
        }

    }
};