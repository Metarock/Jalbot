const { MessageEmbed } = require(`discord.js`);

module.exports = {
    name: "unshuffle",
    category: "Music",
    description: "unshuffle the queue",
    aliases: ["unmix"],
    args: false,
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
            let response = new MessageEmbed()
                .setColor("RED")
                .setDescription("Ming mong, there is no music playing.");
            return message.channel.send({ embeds: [response] });
        }

        const emojishuffle = message.client.emoji.shuffle;

        try {
            //if no shuffle happened, return error
            if (!player.get(`beforeshuffle`)) {
                return message.channel.send({
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
            return message.channel.send({
                embeds: [new MessageEmbed()
                    .setTitle('Sucesss | Unshuffled the queue')
                    .setColor('#34eba1')]
            }
            )
        } catch (e) {
            console.log(String(e.stack).bgRed)
            return message.channel.send({
                embeds: [new MessageEmbed()
                    .setColor('RED')
                    .setTitle(`ERROR | An error occurred`)
                    .setDescription(`\`\`\`${e.message}\`\`\``)]
            }
            );
        }
    }
}