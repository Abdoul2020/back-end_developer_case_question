const fs = require("fs");
const path = require("path");
const database = require("../util/database");

const basename = path.basename(__filename);
const models = {};

// Load models
fs.readdirSync(__dirname)
  .filter((file) => {
    return file !== basename && file.slice(-3) === ".js";
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file));
    models[model.name] = model;
  });

// Associate models if needed
Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

module.exports = {
  ...models,
  database, // Exporting the Sequelize instance
};
