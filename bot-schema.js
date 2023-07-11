import mongoose from "mongoose";

const botSchema = new mongoose.Schema({
    guildID: {
        type: String,
        required: true
    },
    channels: [],
    prefix: {
        type: String,
        required: false
    }
});

export default mongoose.model("Bot", botSchema, "Bot");