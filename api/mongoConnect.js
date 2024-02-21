const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URI);
        console.log("DB connected successfuly");
    } catch (error) {
        console.log(error);
    };
};

module.exports = { connectDB };
