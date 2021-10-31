const { MessageEmbed, CommandInteraction, Client } = require("discord.js")

module.exports = {
    name: "unshuffle",
    description: "unshuffle queue",
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

        if (!player.queue.current) {
            let response = new MessageEmbed()
                .setColor("RED")
                .setDescription("Ming mong, there is no music playing.");
            return interaction.editReply({ embeds: [response] });
        }

        const emojishuffle = client.emoji.shuffle;

        try {
            //if no shuffle happened, return error
            if (!player.get(`beforeshuffle`)) {
                return interaction.editReply({
                    embeds: [new MessageEmbed()
                        .setColor('RED')
                        .setTitle(`ERROR |Have no shuffled this queue yet`)
                        .setDescription(` To shuffle type command: \`?shuffle\``)]
                }
                );
            }

            //clear the queue
            player.queue.clear();
            //add old queue again
            for (const track of player.get(`beforeshuffle`))
                player.queue.add(track);
            return interaction.editReply({
                embeds: [new MessageEmbed()
                    .setTitle(`${emojishuffle} Sucesss | Unshuffled the queue`)
                    .setColor('#34eba1')]
            }
            )
        } catch (e) {
            console.log(String(e.stack).bgRed)
            return interaction.editReply({
                embeds: [new MessageEmbed()
                    .setColor('RED')
                    .setTitle(`ERROR | An error occurred`)
                    .setDescription(`\`\`\`${e.message}\`\`\``)]
            }
            );
        }
    }
};