const { MessageEmbed } = require("discord.js");
const { readdirSync } = require('fs')
const dropdownMenu = require('../../utils/menu');

module.exports = {
    name: "pain",
    category: "Painquotes",
    aliases: ["p"],
    description: "Return all hall of pain",
    args: false,
    usage: "",
    permission: [],
    owner: false,
    execute: async (message, args, client, prefix) => {

        const channel = client.channels.cache.get("837258504741191730")

        const search = args.join(' ');

        const Id = search.replace(/\D/g, '');
        console.log(Id);

        // fetch
        channel.messages.fetch({ limit: 100 }).then(messages => {
            console.log(`Received ${messages.size} messages`);
            //Iterate through the messages here with the variable "messages".
            //TO DO ONLY GET 
            messages.filter(message => message.author.id === Id).map(mes =>
                message.channel.send({
                    embeds: [new MessageEmbed()
                        .setDescription(`${mes.content} ${mes.author}`)
                    ]
                })
            )
        })

    }
}