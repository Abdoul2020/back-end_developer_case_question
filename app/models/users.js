const { DataTypes } = require("sequelize");
const database = require("../util/database");

console.log("olayneUser");

const User = database.define("User", {
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
  // Uncomment and use these if you need email and password fields
  // email: {
  //   type: DataTypes.STRING,
  //   allowNull: false
  // },
  // password: {
  //   type: DataTypes.STRING,
  //   allowNull: false
  // }
});

//associate user with the boos
User.associate = (models) => {
  User.belongsToMany(models.Book, {
    through: "LibraryTransaction",
    as: "borrowedBooks",
    foreignKey: "userId",
  });
};

module.exports = User;
