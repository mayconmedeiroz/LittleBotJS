const Discord = require("discord.js");
const { prefix, token } = require("./config.json");
const ytdl = require("ytdl-core");

const client = new Discord.Client();

client.once("ready", () => {
    console.log("Conectado!");
});

client.on("message", async message => {
    if (message.author.bot || !message.content.startsWith(prefix)) return;

    if (message.content.startsWith(`${prefix}play`)) {
        play(message);
        return;
    }
});

async function play(message) {

    const args = message.content.split(" ");

    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel) {
        return message.channel.send("Você precisa estar em um canal de voz para tocar música!");
    }

    const permissions = voiceChannel.permissionsFor(message.client.user);

    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return message.channel.send("Preciso de permissão para entrar e falar no canal de voz!");
    }

    const songInfo = await ytdl.getInfo(args[1]);

    const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url
    };

    try {
        let connection = await voiceChannel.join();

        const dispatcher = connection
            .play(ytdl(song.url))
            .on("error", error => console.error(error));

        message.channel.send(`Está tocando: **${song.title}**`);

    } catch (err) {
        console.error(err);
    }
}

client.login(token);