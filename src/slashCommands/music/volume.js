const { CommandInteraction, Client, MessageEmbed } = require("discord.js");

module.exports = {
    name: "volume",
    description: "Changes volume of currently playing music.",
    owner: false,
    player: true,
    inVoiceChannel: true,
    sameVoiceChannel: true,
    options: [
        {
            name: "number",
            description: "give your volume number ",
            required: true,
            type: "NUMBER"
        }
    ],

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
        const volumeEmoji = client.emoji.volumehigh;
        const emojivolume = client.emoji.volumehigh;

        const vol = interaction.options.getNumber("number");

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
            let response = new MessageEmbed()
                .setColor("RED")
                .setDescription("Ming mong, there is no music playing.");
            return await interaction.editReply({ embeds: [response] });
        }

        if (!args.length) {
            response = new MessageEmbed()
                .setColor(client.embedColor)
                .setTimestamp()
                .setDescription(`${emojivolume} The player volume \`${player.volume}\``)
            return await interaction.editReply({ embeds: [response] });
        }

        if (!channel) {
            response = new MessageEmbed()
                .setColor("RED")
                .setTimestamp()
                .setDescription(`you need to join a voice channel good human`)
            return await interaction.editReply({ embeds: [response] });
        }
        if (channel.id !== player.voiceChannel) {
            response = new MessageEmbed()
                .setColor("RED")
                .setTimestamp()
                .setDescription("you are not in the same voice channel as the Jalbot.")
            return await interaction.editReply({ embeds: [response] });
        }

        //if user input is not a Number, then output an error
        if (isNaN(args[0])) {
            response = new MessageEmbed()
                .setColor("RED")
                .setTimestamp()
                .setDescription("You need to input a number")
            return await interaction.editReply({ embeds: [response] });
        }

        const volume = Number(args[0]);

        if (!volume || volume < 1 || volume > 100) {
            response = new MessageEmbed()
                .setColor("RED")
                .setTimestamp()
                .setDescription("I request you to give me a volume between 1 and 100")
            return await interaction.editReply({ embeds: [response] });
        }

        player.setVolume(volume);
        response = new MessageEmbed()
            .setColor(client.embedColor)
            .setTimestamp()
            .setDescription(`${emojivolume} The player volume \`${player.volume}\``)
        return await interaction.editReply({ embeds: [response] });
    }
}