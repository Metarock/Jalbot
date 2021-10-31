const { CommandInteraction, Client, MessageEmbed } = require("discord.js");

module.exports = {
    name: "remove",
    description: "Remove song from the queue",
    owner: false,
    player: true,
    inVoiceChannel: true,
    sameVoiceChannel: true,
    options: [
        {
            name: "number",
            description: "Number of song in queue",
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
            let thing = new MessageEmbed()
                .setColor("RED")
                .setDescription("Ming mong, there is no music playing.");
            return await interaction.editReply({ embeds: [thing] });
        }

        const position = (Number(args) - 1);
        if (position > player.queue.size) {
            const number = (position + 1);
            let thing = new MessageEmbed()
                .setColor("RED")
                .setDescription(`No songs at number ${number}.\nTotal Songs: ${player.queue.size}`);
            return await interaction.editReply({ embeds: [thing] });
        }

        const song = player.queue[position]
        player.queue.remove(position);

        const emojieject = client.emoji.remove;

        let thing = new MessageEmbed()
            .setColor(client.embedColor)
            .setTimestamp()
            .setDescription(`${emojieject} Removed\n[${song.title}](${song.uri})`)
        return await interaction.editReply({ embeds: [thing] });

    }
};