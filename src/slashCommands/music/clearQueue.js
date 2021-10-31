const { MessageEmbed, CommandInteraction, Client } = require('discord.js');

module.exports = {
    name: "clearqueue",
    description: "Clear the entire queue",
    owner: false,
    player: true,
    inVoiceChannel: true,
    sameVoiceChannel: true,
    /**
  * 
  * @param {Client} client 
  * @param {CommandInteraction} interaction 
  */

    run: async (client, interaction) => {
        await interaction.deferReply({
            ephemeral: false
        })
        const player = client.manager.get(interaction.guildId);

        if (!player) {
            let response = new MessageEmbed()
                .setColor("RED")
                .setDescription("Ming mong, there is no player in this guild");
            return interaction.editReply({ embeds: [response] });
        }

        const { channel } = interaction.member.voice;
        if (!channel) {
            let response = new MessageEmbed()
                .setColor("RED")
                .setDescription("You need to join a channel first good human");
            return interaction.editReply({ embeds: [response] });
        }
        if (channel.id !== player.voiceChannel) {
            let response = new MessageEmbed()
                .setColor("RED")
                .setDescription("Ming mong, you are not in the same voice channel as me");
            return interaction.editReply({ embeds: [response] });
        }


        if (!player.queue.current) {
            let response = new MessageEmbed()
                .setColor("RED")
                .setDescription("Ming mong, there is no music playing.");
            return interaction.editReply({ embeds: [response] });
        }


        try {
            //clear the entire queue
            player.queue.clear();

            const emojieject = client.emoji.remove;


            return interaction.editReply({
                embeds: [new MessageEmbed()
                    .setColor(client.embedColor)
                    .setTimestamp()
                    .setDescription(`${emojieject}Jalbot has cleared all the tracks in the queue`)
                ]
            })
        } catch (error) {
            return interaction.editReply({
                embeds: [new MessageEmbed()
                    .setColor("RED")
                    .setDescription(`There was an error clearing the queue\n [ERROR MESSAGE]: ${error}`)]
            })
        }
    }
}