const { Sequelize } = require("@sequelize/core");
const { PostgresDialect } = require("@sequelize/postgres");
require("dotenv").config({ path: "../.env" });

const sequelize = new Sequelize({
    dialect: PostgresDialect,
    database: process.env.DATABASE,
    user: process.env.USER,
    password: process.env.PASSWORD,
    host: process.env.HOST,
    port: process.env.PORT,
    // TODO: Update on production
    ssl: false,
    clientMinMessages: "notice",
});

module.exports = sequelize;
