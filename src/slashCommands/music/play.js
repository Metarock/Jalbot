const { CommandInteraction, Client, MessageEmbed } = require("discord.js");

module.exports = {
    name: "play",
    description: "To play some song.",
    owner: false,
    player: false,
    inVoiceChannel: true,
    sameVoiceChannel: false,
    options: [
        {
            name: "input",
            description: "The search input (name/url)",
            required: true,
            type: "STRING"
        }
    ],

    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */

    run: async (client, interaction,) => {
        await interaction.deferReply({
            ephemeral: false
        });
        const emojiaddsong = client.emoji.addsong;
        const emojiplaylist = client.emoji.playlist;

        if (!interaction.replied) await interaction.deferReply().catch(() => { });
        const query = interaction.options.getString("input");
        if (!query) return await interaction.editReply({
            ephemeral: true, embeds: [new MessageEmbed().setColor(client.embedColor).setDescription("Please provide a search input to search.")]
        }).catch(() => { });
        if (!interaction.member.voice.channel) return await interaction.editReply({
            ephemeral: true, embeds: [new MessageEmbed().setColor(client.embedColor).setDescription("You are not connected to a voice channel to use this command.")]
        }).catch(() => { });

        let player = client.manager.get(interaction.guildId);
        if (!player) player = client.manager.create({
            guild: interaction.guildId,
            textChannel: interaction.channelId,
            voiceChannel: interaction.member.voice.channelId,
            selfDeafen: true,
            volume: 100
        });

        const s = await player.search(query, interaction.user);
        if (s.loadType === "LOAD_FAILED") {
            if (player && !player.queue.current) player.destroy();
            return await interaction.editReply({
                content: `Unable to load ${query}`
            }).catch(() => { });
        } else if (s.loadType === "NO_MATCHES") {
            if (player && !player.queue.current) player.destroy();
            return await interaction.editReply({
                content: `No results found for ${query}`
            }).catch(() => { });
        } else if (s.loadType === "TRACK_LOADED") {
            if (player && player.state !== "CONNECTED") player.connect();
            if (player) player.queue.add(s.tracks[0]);
            if (player && player.state === "CONNECTED" && !player.playing && !player.paused && !player.queue.size) player.play();
            return await interaction.editReply({
                embeds: [new MessageEmbed().setColor(client.embedColor).setDescription(`${emojiaddsong} Added ${s.tracks[0].uri && s.tracks[0].title ? `[${s.tracks[0].title}](${s.tracks[0].uri})` : `${s.tracks[0].title}`} to the queue.`)]
            }).catch(() => { });
        } else if (s.loadType === "PLAYLIST_LOADED") {
            if (player && player.state !== "CONNECTED") player.connect();
            if (player) player.queue.add(s.tracks);
            if (player && player.state === "CONNECTED" && !player.playing && !player.paused && player.queue.totalSize === s.tracks.length) player.play();

            return await interaction.editReply({
                embeds: [new MessageEmbed().setColor(client.embedColor).setDescription(`${emojiplaylist} Added ${s.tracks.length} tracks from [${s.playlist.name}](${query}) to the queue.`)]
            }).catch(() => { });
        } else if (s.loadType === "SEARCH_RESULT") {
            if (player && player.state !== "CONNECTED") player.connect();
            let max = 5, collected, filter = (m) => m.member.id === interaction.member.id && /^(\d+|end)$/i.test(m.content);
            if (s.tracks.length < max) max = s.tracks.length;

            const playlistResults = s.tracks
                .slice(0, max)
                .map((track, index) => `(${++index}) - [${track.title}](${track.uri})`)
                .join('\n')

            const searchResult = new MessageEmbed()
                .setColor('#00f70c')
                .setTitle('Search Results: ')
                .setDescription(playlistResults)
                .addField('Cancel Search: ', 'Type end or any other number to cancel to search', true)
                .setTimestamp()
            interaction.editReply({ embeds: [searchResult] });

            try {
                collected = await interaction.channel.awaitMessages(
                    {
                        filter,
                        max: 1,
                        time: 30e3,
                        errors: ['time']
                    });
            } catch (e) {
                if (!player.queue.current) player.destroy();
                return interaction.editReply({ embeds: [new MessageEmbed().setColor(client.embedColor).setDescription("Ming mong, you did not select")] })
            }

            const first = collected.first().content;

            const cancel = new MessageEmbed()
                .setColor('#00f70c')
                .setTitle('Cancelling search ')
                .setDescription('Ming mong, cancelling')

            if (first.toLowerCase() === 'end') {
                if (!player.queue.current) player.destroy();
                return message.channel.send({ embeds: [cancel] })
            }

            const index = Number(first) - 1;
            if (index < 0 || index > max - 1) return message.reply(`the number you provided too small or too big (1-${max}).`);

            const track = s.tracks[index];


            if (player) player.queue.add(track);
            if (player && player.state === "CONNECTED" && !player.playing && !player.paused && !player.queue.size) player.play();
            return await interaction.editReply({
                embeds: [new MessageEmbed().setColor(client.embedColor).setDescription(`${emojiplaylist} Added ${s.tracks[0].uri && s.tracks[0].title ? `[${s.tracks[0].title}](${s.tracks[0].uri})` : `${s.tracks[0].title}`} to the queue.`)]
            }).catch(() => { });
        } else return await interaction.editReply({
            content: `No results found for ${query}`
        }).catch(() => { });
    }
}
