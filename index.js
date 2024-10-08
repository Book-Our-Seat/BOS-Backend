const express = require("express");
const cron = require("node-cron");
const cors = require("cors")

require("dotenv").config();
const app = express();
const path = require("path");

app.use(express.json({ limit: '10mb' }));
const port = process.env.SERVER_PORT;

const sequelize = require("./config/config");
const mainRouter = require("./src/routers/mainRouter");

// app.use(express.static(path.join(__dirname, "frontend/build")));
// Cron to clear up pending bookings
// require("./src/cronjobs/bookingCronJob");
app.use(express.json());
app.use(cors());
app.use(mainRouter);

const initApp = async () => {
    console.log("::establishing database connection");

    try {
        await sequelize.authenticate();

        await sequelize.sync();

        app.listen(port, () => {
            console.log(`::listening on ${port}`);
        });
    } catch (error) {
        console.error("::database authentication failed", error.message);
    }
};

initApp();
