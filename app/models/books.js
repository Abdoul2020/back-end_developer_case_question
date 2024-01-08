const { DataTypes } = require("sequelize");
const database = require("../util/database");

const Book = database.define("Book", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

Book.associate = (models) => {
  Book.belongsToMany(models.User, {
    through: "LibraryTransaction",
    as: "borrowedBy",
    foreignKey: "bookId",
  });
};

module.exports = Book;
