const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    category: { type: String, required: true },
    startDate: { type: Date, required: false },
    endDate: { type: Date, required: false },
    banner: { type: String },
    createBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
        type: String,
        enum: ["pending", "rejected", "approved", "completed", "ended"],
        default: "pending"
    },
}, { timestamps: true })

const Event = mongoose.model("Event", EventSchema);
module.exports = Event;