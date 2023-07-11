import parrot from '@ratinchat/parrot.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import botSchema from './bot-schema.js';
dotenv.config();

const bot = new parrot.Bot({
    token: process.env.TOKEN,
    intents: ['Guilds', 'GuildMembers', 'GuildMessages', 'MessageContent']
});

import { HfInference } from '@huggingface/inference'

const hf = new HfInference(process.env.HF_TOKEN)
// let history = [];
// let generated = [];

async function newChat(message) {
    if (!message) return {};
    const res = await hf.conversational({
        model: 'RatInChat/Pilup7575',
        inputs: {
            text: message
        }
    })
    // history = res.conversation.past_user_inputs;
    // generated = res.conversation.generated_responses;
    return res.generated_text;
}

// const interactionCommands = await bot.initSlashCommands();
await parrot.ImportSlashCommands(bot, './commands');
// await interactionCommands.registerAll(process.env.TOKEN, bot);


const events = await bot.initEvents();

await events.newEvent({
    name: 'ready',
    execute: async () => {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');
    }
});

await events.newEvent({
    name: 'messageCreate',
    execute: async (message) => {
        if (!message.guild) return;
        if (message.author.id == '1070889452152561714') return;
        const MessageContent = message.content;
        const guild = message.guild.id;
        const channel = message.channel.id;
        const guildSchema = await botSchema.findOne({ guildID: guild });
        if (!guildSchema) return;
        const splicedMessage = MessageContent.split(' ');
        const prefix = guildSchema.prefix;
        if (splicedMessage[0].startsWith(prefix)) return;
        const guildChannels = guildSchema.channels;
        const channelCheck = guildChannels.find(c => c.channel === channel);
        if (!channelCheck) return;
        message.channel.sendTyping();
        let response = await newChat(`${MessageContent}`);
        if (response === ' ' || response === '' || response === null || response === undefined) {
            response = 'idk.'
        }
        message.channel.send(`${response}`);
    }
});
