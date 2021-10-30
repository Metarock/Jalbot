const { MessageEmbed } = require('discord.js')
const { convertTime } = require('../../utils/convert');

module.exports = {
    name: 'play',
    category: "Music",
    aliases: ["p"],
    description: 'Play your favorite music from youtube or spotify',
    args: true,
    usage: "Provide me any youtube name or URL link or Spotify urls :)",
    permission: [],
    owner: false,
    player: false,
    inVoiceChannel: true,
    sameVoiceChannel: false,
    execute: async (message, args, client, prefix) => {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setColor("RED")
                    .setDescription("Ming mong you need to join a channel")
            ]
        })
        if (!args.length) return message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setColor("RED")
                    .setDescription("Ming you need to give me a URL or a search term")
            ]
        });

        const player = client.manager.create({
            guild: message.guild.id,
            voiceChannel: voiceChannel.id,
            textChannel: message.channel.id,
        })

        //if player is not connected
        if (player.state !== 'CONNECTED') player.connect()

        player.set("autoplay", false);

        const emojiaddsong = message.client.emoji.addsong;
        const emojiplaylist = message.client.emoji.playlist;
        const search = args.join(' ');

        let results;

        try {
            results = await player.search(search, message.author);
            if (results.loadType === 'LOAD_FAILED') {
                if (!player.queue.current) player.destroy();
                throw results.exception;
            }
        } catch (err) {
            return message.reply(`There was an error while searching: ${err.message}`)
        }

        switch (results.loadType) {
            case 'NO_MATCHES':
                if (!player.queue.current) player.destroy();
                return message.reply('Ming mong, I found no results :(');
            case 'TRACK_LOADED':

                const playMusic = new MessageEmbed()
                    .setColor(client.embedColor)
                    .setThumbnail(results.tracks[0].displayThumnail("hqdefault"))
                    .setDescription(`${emojiaddsong} **Enqueuing song**\n [${results.tracks[0].title}](${results.tracks[0].uri}) - \`[${convertTime(results.tracks[0].duration)}]\``)
                    .setTimestamp()

                player.queue.add(results.tracks[0])

                if (!player.playing && !player.paused && !player.queue.size) player.play();
                return message.channel.send({ embeds: [playMusic] });
            case 'PLAYLIST_LOADED':
                player.queue.add(results.tracks);

                const playlist = new MessageEmbed()
                    .setColor(client.embedColor)
                    .setTimestamp()
                    .setDescription(`${emojiplaylist} **Enqueuing playlist**\n${results.tracks.length} Songs **${results.playlist.name}** - \`[${convertTime(results.playlist.duration)}]\``)

                if (!player.playing && !player.paused && player.queue.totalSize === results.tracks.length) player.play();
                return message.channel.send({ embeds: [playlist] });
            case 'SEARCH_RESULT':
                let max = 5, collected, filter = (m) => m.author.id === message.author.id && /^(\d+|end)$/i.test(m.content);
                if (results.tracks.length < max) max = results.tracks.length;

                const playlistResults = results.tracks
                    .slice(0, max)
                    .map((track, index) => `(${++index}) - [${track.title}](${track.uri})`)
                    .join('\n')

                const searchResult = new MessageEmbed()
                    .setColor('#00f70c')
                    .setTitle('Search Results: ')
                    .setDescription(playlistResults)
                    .addField('Cancel Search: ', 'Type end or any other number to cancel to search', true)
                    .setTimestamp()
                message.channel.send({ embeds: [searchResult] });

                try {
                    collected = await message.channel.awaitMessages(
                        {
                            filter,
                            max: 1,
                            time: 30e3,
                            errors: ['time']
                        });
                } catch (e) {
                    if (!player.queue.current) player.destroy();
                    return message.reply("Ming mong, left and right, you did not provide a selection")
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

                const track = results.tracks[index];
                player.queue.add(track);

                const chosenMusic = new MessageEmbed()
                    .setColor(client.embedColor)
                    .setThumbnail(track.displayThumbnail("hqdefault"))
                    .setDescription(`${emojiaddsong} **Enqueuing song**\n [${track.title}](${track.uri}) - \`[${convertTime(track.duration)}]`)
                    .setTimestamp()

                if (!player.playing && !player.paused && !player.queue.size) player.play();
                return message.channel.send({ embeds: [chosenMusic] });
        }
    }
}

