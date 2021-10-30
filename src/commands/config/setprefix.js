
const { MessageEmbed } = require('discord.js');
const pre = require('../../schema/prefix.js');
const mongoose = require('mongoose');
const client = require('../..');


module.exports = {
    name: "setprefix",
    category: "Config",
    description: "Another bot uses our prefx? Not to worry, you can set your own custom prefix for this server",
    args: false,
    usage: "",
    alises: ["prefix"],
    permission: [],
    owner: false,
    execute: async (message, args, client) => {

        if (!message.member.permissions.has('MANAGE_GUILD')) return message.channel.send('Ming mong you must have permission to use this command. Ask an admin to use this command, bobo');

        if (!args[0]) {
            const response = new MessageEmbed()
                .setDescription('AYSSH please give me the prefix you want to set, ming mong')
                .setColor(client.embedColor)
            return message.channel.send({ embeds: [response] })
        }

        if (args[1]) {
            const response = new MessageEmbed()
                .setDescription('Whatchu doin, you cannot give double arguments to set a prefix')
                .setColor(client.embedColor)
            return message.channel.send({ embeds: [response] })
        }
        if (args[0].length > 3) {
            const response = new MessageEmbed()
                .setDescription('Hayz, you cannot give more than 3 characters')
                .setColor(client.embedColor)
            return message.channel.send({ embeds: [response] })
        }
        const res = await pre.findOne({ guildid: message.guild.id })
        let prefix = args.join(" ");
        let p;
        if (!res) p = ">"
        else p = res.prefix;
        const noperms = new MessageEmbed()
            .setColor("#651FFF")
            .setDescription(`The prefix for this server is \`${p}\``)
        let newprefix = args.join(" ");
        if (!args[0]) return message.channel.send({ embeds: [noperms] });
        else {
            pre.findOne({ guildid: message.guild.id }).then(result => {
                //set the prefix to the mongoose data
                let duck = new pre({
                    _id: new mongoose.Types.ObjectId(),
                    guildid: message.guild.id,
                    prefix: prefix
                })
                let send = new MessageEmbed()
                    .setDescription(`Changed prefix to \`${newprefix}\``)
                    .setTimestamp()
                    .setColor("#651FFF")
                message.channel.send({ embeds: [send] });
                if (!result || result == []) {
                    duck.save().catch(console.error);
                } else {
                    pre.deleteOne({ guildid: message.guild.id }).catch(console.error)
                    duck.save().catch(console.error)
                }
            })
        }
    }
}