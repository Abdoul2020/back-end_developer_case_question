const Sequelize = require("sequelize");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../../.env") });

const env = process.env.NODE_ENV || "development";

const config = require("../../config/config.json")[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: "postgres",
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("database ile bağlantı kuruldu.");
  })
  .catch((err) => {
    console.error("database ile bağalntı kurulamadı:", err);
  });

module.exports = sequelize;
