const { MessageEmbed } = require('discord.js');
const pre = require('../../schema/prefix');
const mongoose = require('mongoose');

module.exports = {
    name: "setprefix",
    description: "Another bot uses our prefx? Not to worry, you can set your own custom prefix for this server",
    options: [
        {
            name: "prefix",
            description: "Another bot uses our prefx? Not to worry, you can set your own custom prefix for this server",
            required: true,
            type: "STRING"
        }
    ],
    run: async (client, interaction) => {
        const args = interaction.options.getString("prefix");

        if (!interaction.member.permissions.has('MANAGE_GUILD')) return await interaction.editReply({
            ephemeral: true, embeds: [new MessageEmbed()
                .setColor(client.embedColor)
                .setDescription("Ming mong you must have permission to use this command. Ask an admin to use this command, bobo")]
        }).catch(() => { });

        if (!args[0]) {
            const embed = new MessageEmbed()
                .setDescription("AYSSH please give me the prefix you want to set, ming mong")
                .setColor(client.embedColor)
            return await interaction.editReply({ embeds: [embed] });
        }

        if (args[1]) {
            const embed = new MessageEmbed()
                .setDescription("Whatchu doin, you cannot give double arguments to set a prefix")
                .setColor(client.embedColor)
            return await interaction.editReply({ embeds: [embed] });
        }

        if (args[0].length > 3) {
            const embed = new MessageEmbed()
                .setDescription("Hayz, you cannot give more than 3 characters")
                .setColor(client.embedColor)
            return await interaction.editReply({ embeds: [embed] });
        }

        const res = await pre.findOne({ guildid: interaction.guildId })
        let prefix = args();
        let p;
        if (!res) p = "!"
        else p = res.prefix;
        const noperms = new MessageEmbed()
            .setColor("#651FFF")
            .setDescription(`The prefix for this server is \`${p}\``)
        let newprefix = args();
        if (!args[0]) return interaction.editReply({ embeds: [noperms] });
        else {
            pre.findOne({ guildid: interaction.guildId }).then(result => {
                let duck = new pre({
                    _id: new mongoose.Types.ObjectId(),
                    guildid: interaction.guildId,
                    prefix: prefix
                })
                let send = new MessageEmbed()
                    .setDescription(`Changed prefix to \`${newprefix}\``)
                    .setTimestamp()
                    .setColor("#651FFF")
                interaction.editReply({ embeds: [send] });
                if (!result || result == []) {
                    duck.save().catch(console.error);
                } else {
                    pre.deleteOne({ guildid: interaction.guildId }).catch(console.error)
                    duck.save().catch(console.error)
                }
            })
        }
    }
}