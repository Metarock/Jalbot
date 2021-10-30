const { MessageEmbed } = require(`discord.js`);

module.exports = {
    name: "shuffle",
    category: "Music",
    description: "Shuffle the queue",
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
            //set the old Queue, before the shuffle....
            player.set(`beforeshuffle`, player.queue.map(track => track));

            //shuffle the queue
            player.queue.shuffle();

            return message.channel.send({
                embeds: [new MessageEmbed()
                    .setTitle(`${emojishuffle} Sucesss | Shuffled the queue`)
                    .setColor('#34eba1')]
            })

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