const mongoose = require("mongoose");

const connectDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("connect database success")
    } catch (error) {
        console.log("connect database failed ", error.message);
        process.exit(1);
    }
};

module.exports = connectDatabase;