const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'moveme',
    aliases: ['mm', 'mvm', 'my', 'mvy', 'moveyou'],
    category: "Music",
    description: 'moves you to the music channel',
    args: false,
    usage: "Moves you to the channel",
    permission: [],
    owner: false,
    player: true,
    inVoiceChannel: true,
    sameVoiceChannel: false,
    execute: async (message, args, client, prefix) => {
        try {
            let channel = message.member.voice.channel;
            let botchannel = message.guild.me.voice.channel;
            if (!botchannel)
                return message.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor('RED')
                        .setTitle(`ERROR | I am connected nowhere`)]
                }
                );
            if (!channel)
                return message.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor('RED')
                        .setTitle(`ERROR | Please Connect first`)]
                }
                );
            if (botchannel.userLimit >= botchannel.members.length)
                return message.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor('RED')
                        .setTitle(`ERROR | The Channel is full, I cant move you`)]
                }
                );
            if (botchannel.id == channel.id)
                return message.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor('RED')
                        .setTitle(`ERROR | You are already in my channel `)]
                }
                );
            message.member.voice.setChannel(botchannel);
            return message.channel.send({
                embeds: [new MessageEmbed()
                    .setColor('#34eba1')
                    .setTitle(`SUCCESS | moved you to: \`${botchannel.name}\``)]
            }
            );
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
