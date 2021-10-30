const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'pause',
    aliases: ['ps'],
    description: 'Pauses the current music',
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

        const emojipause = message.client.emoji.pause;
        //if there is no music playing
        if (!player.queue.current) {
            response = new MessageEmbed()
                .setColor("RED")
                .setDescription("There are no current music playing");
        }

        if (player.paused) {
            response = new MessageEmbed()
                .setColor("RED")
                .setDescription(`${emojipause} Ming mong, the player is already paused`)
                .setTimestamp()
            return message.channel.send({ embeds: [response] })
        }

        //if all conditions do not pass, then we can pause the bot from playing music
        player.pause(true);

        return message.channel.send({
            embeds: [new MessageEmbed()
                .setColor(message.client.embedColor)
                .setTimestamp()
                .setDescription(`${emojipause} **Pausing**\n[${player.queue.current.title}](${player.queue.current.uri})`)
            ]
        })
    }
}
