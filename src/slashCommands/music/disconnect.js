const { MessageEmbed, CommandInteraction, Client } = require('discord.js');

module.exports = {
    name: "disconnect",
    description: "Disconnect from voice channel",
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

        const emojiLeave = client.emoji.leave;

        player.destroy();

        let response = new MessageEmbed()
            .setColor(client.embedColor)
            .setDescription(`${emojiLeave} **Left the voice channel**\nThank you for using ${client.user.username}!`)
        return interaction.editReply({ embeds: [response] });
    }
}