const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    location: { type: String },
    age: { type: String },
    gender: {
        type: String,
        enum: ["male", "female", "none"],
        default: "none"
    },
    role: {
        type: String,
        enum: ["admin", "manager" , "user"],
        default: "user",
    },
    status: {
        type: String,
        enum: ["active", "banned"],
        default: "active",
    },

},
    { timestamps: true })

const User = mongoose.model("User", UserSchema);
module.exports = User;