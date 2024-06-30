const express = require("express");
require('dotenv').config();
const app = express();
const path = require("path");

const port = process.env.SERVER_PORT;

const sequelize = require("./config/sequelizeConfig");
const mainRouter = require("./src/routers/mainRouter")

// app.use(express.static(path.join(__dirname, "frontend/build")));
app.use(express.json());
app.use("/api", mainRouter);



const initApp = async () => {
  console.log("::establishing database connection");

  try {
    await sequelize.authenticate();

    await sequelize.sync()
    
    app.listen(port, () => {
      console.log(`::listening on ${port}`);
    });

  } catch (error) {
    console.error("::database authentication failed", error.message);
  }
};

initApp();

