const { MessageEmbed, CommandInteraction, Client } = require("discord.js")

module.exports = {
    name: "pause",
    description: "Pauses the current music",
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
        });
        const player = client.manager.get(interaction.guildId);
        let response;
        if (!player) {
            response = new MessageEmbed()
                .setColor("RED")
                .setDescription("Ming mong, there is no player in this guild");
            return interaction.editReply({ embeds: [response] });
        }

        const { channel } = interaction.member.voice;
        if (!channel) {
            response = new MessageEmbed()
                .setColor("RED")
                .setDescription("You need to join a channel first good human");
            return interaction.editReply({ embeds: [response] });
        }
        if (channel.id !== player.voiceChannel) {
            response = new MessageEmbed()
                .setColor("RED")
                .setDescription("Ming mong, you are not in the same voice channel as me");
            return interaction.editReply({ embeds: [response] });
        }

        const emojipause = client.emoji.pause;
        //if there is no music playing
        if (!player.queue.current) {
            response = new MessageEmbed()
                .setColor("RED")
                .setDescription("There are no current music playing");
            return interaction.editReply({ embeds: [response] })
        }

        if (player.paused) {
            response = new MessageEmbed()
                .setColor("RED")
                .setDescription(`${emojipause} Ming mong, the player is already paused`)
                .setTimestamp()
            return interaction.editReply({ embeds: [response] })
        }

        //if all conditions do not pass, then we can pause the bot from playing music
        player.pause(true);

        return interaction.editReply({
            embeds: [new MessageEmbed()
                .setColor(client.embedColor)
                .setTimestamp()
                .setDescription(`${emojipause} **Pausing**\n[${player.queue.current.title}](${player.queue.current.uri})`)
            ]
        })
    }
};