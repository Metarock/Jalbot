module.exports = {
    name: "clearCommands",
    category: "Information",
    aliases: ["clear"],
    description: "Clear the commands in the text channel",
    args: false,
    usage: "",
    permission: [],
    owner: false,
    player: false,
    inVoiceChannel: false,
    sameVoiceChannel: false,
    execute: async (message, args, client, prefix) => {
        message.delete()
        message.channel.bulkDelete(3);
    }
}