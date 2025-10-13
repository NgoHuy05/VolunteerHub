const mongoose = require("mongoose");

const UserEventSchema = new mongoose.Schema(
    {
        userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
        eventId: {type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true},
        role: {type: String, required: true,
            enum: ["admin", "manager", "user"],
            default: "user"
        },
        status: {type: String, required: true ,
            enum: ["pending", "joining", "rejected", "completed", "none"],
            default: "none"
        },
        startDay: {type: Date, required: true}
    },
    {timestamps: true},
)
const UserEvent = mongoose.model("UserEvent", UserEventSchema);
module.exports = UserEvent;