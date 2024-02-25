const { app } = require("./app");
const { connectDB } = require("./db/connectDB");
// require("dotenv").config();

const port = process.env.PORT;

const startServer = async () => {
    try {
        await connectDB();
        app.listen(port, () => {
            console.log(`Server is running. Use our API on port: ${port}`);
        });
    } catch (error) {
        console.log(error);
    };
};

startServer();
