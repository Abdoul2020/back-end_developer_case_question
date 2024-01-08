const { DataTypes } = require("sequelize");

const database = require("../util/database");

console.log("library");

const LibraryTransaction = database.define("LibraryTransaction", {
  status: {
    type: DataTypes.ENUM("borrowed", "returned"),
    allowNull: false,
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  bookId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

LibraryTransaction.associate = (models) => {
  LibraryTransaction.belongsTo(models.User, { foreignKey: "userId" });
  LibraryTransaction.belongsTo(models.Book, { foreignKey: "bookId" });
};

module.exports = LibraryTransaction;
