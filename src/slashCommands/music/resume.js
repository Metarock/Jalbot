const { MessageEmbed, CommandInteraction, Client } = require("discord.js")

module.exports = {
    name: "resume",
    description: "Resume currently playing music",
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

        const emojiresume = client.emoji.resume;

        if (!player.paused) {
            response = new MessageEmbed()
                .setColor("RED")
                .setDescription(`${emojiresume} Ming mong, the player is already resumed`)
            return interaction.editReply({ embeds: [response] });
        }

        //resume the player
        player.pause(false)
        response = new MessageEmbed()
            .setDescription(`${emojiresume} **Resuming**\n[${player.queue.current.title}](${player.queue.current.uri})`)
            .setColor(client.embedColor)
            .setTimestamp()
        return interaction.editReply({ embeds: [response] })

    }
};