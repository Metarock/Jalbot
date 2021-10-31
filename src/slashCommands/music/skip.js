const { CommandInteraction, Client, MessageEmbed } = require("discord.js");

module.exports = {
    name: "skip",
    description: "To skip a song/track from the queue.",
    owner: false,
    player: true,
    inVoiceChannel: true,
    sameVoiceChannel: true,


    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     * @param {String} color 
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

        const autoplay = player.get("autoplay");
        const { title } = player.queue.current;

        if (autoplay === false) {
            player.stop();
        } else {
            player.stop();
            player.queue.clear();
            player.set("autoplay", false);
        }

        const emojiskip = client.emoji.skip;

        response = new MessageEmbed()
            .setDescription(`${emojiskip} ${title} was skipped`)
            .setColor(message.client.embedColor)
            .setTimestamp()
        return await interaction.editReply({ embeds: [response] });
    }
}