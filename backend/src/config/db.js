const mongoose = require("mongoose");
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);

        console.log("mongoDB connect");
    } catch (error) {
        console.error("mongoDB Error:", error.message);
    }
};
module.exports = connectDB;