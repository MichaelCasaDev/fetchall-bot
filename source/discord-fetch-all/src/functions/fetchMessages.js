'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
// const discord_js_1 = require('discord.js');
exports.default = async (channel, options = { reverseArray: false, userOnly: false, botOnly: false, pinnedOnly: false, max: 200 }) => {
    // if (!(channel instanceof discord_js_1.TextChannel)) {throw new Error('discord-fetch-all: channel parameter is not a instance of a discord channel.');}
    const { reverseArray, userOnly, botOnly, pinnedOnly, max } = options;
    let messages = [];
    let lastID;
    let maxO = 0;
    while (true) { // eslint-disable-line no-constant-condition
        const fetchedMessages = await channel.messages.fetch({
            limit: 100,
            ...(lastID && { before: lastID }),
        });
        maxO = maxO + 100;
        if (fetchedMessages.size === 0 || maxO == max ) {
            if (reverseArray) {messages = messages.reverse();}
            if (userOnly) {messages = messages.filter(msg => !msg.author.bot);}
            if (botOnly) {messages = messages.filter(msg => msg.author.bot);}
            if (pinnedOnly) {messages = messages.filter(msg => msg.pinned);}
            return messages;
        }
        messages = messages.concat(Array.from(fetchedMessages.values()));
        lastID = fetchedMessages.lastKey();
    }
};
