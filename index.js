const Discord = require("discord.js");
const bot = new Discord.Client();
const fetchAll = require('./source/discord-fetch-all');
const fs = require("fs");
const request = require('request-promise');
const EventEmitter = require('events');
const events = new EventEmitter();

const TOKEN = "YOUR_TOKEN_HERE";
const CHANNEL_ID = "CHANNEL_ID_TO_FETCH";

let i = 0;
let i2 = 0;
let startTime = new Date();



bot.on("ready", () => {
    console.log("Bot started! Start fetching some message...");
    bot.channels.fetch(CHANNEL_ID).then(async channelx => {
        const allMessages = await fetchAll.messages(channelx, {
            reverseArray: true, // Reverse the returned array
            userOnly: true, // Only return messages by users
            botOnly: false, // Only return messages by bots
            pinnedOnly: false, // Only returned pinned messages
            max: 1000,
        });

        allMessages.forEach(async e => {
            if (e.attachments.size == 1) {
                await request(e.attachments.first().url)
                    .pipe(fs.createWriteStream(`./data/${e.id}.${e.attachments.first().url.substr(e.attachments.first().url.length - 3)}`)
                        .on("finish", () => {
                            console.log("Download ended #" + i2++);
                            if (i == i2) {
                                events.emit("end");
                            }
                        })
                    )
                console.log("Data found! #" + i++ + " ID: " + e.id);
            }
        })
    })
})

events.on("end", () => {
    let timeDiff = new Date() - startTime;
    timeDiff /= 1000;

    let seconds = Math.round(timeDiff);
    console.log("\n\nTime elapsed: " + seconds + "s");
})

bot.login(TOKEN);