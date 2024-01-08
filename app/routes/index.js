const userRoutes = require("./userRoutes");
const bookRoutes = require("./booksRoutes");
const libraryRoutes = require("./libraryRoutes");
const database = require("../util/database");

const router = require("express").Router();

// Add your routes here
router.use("/users", userRoutes);
router.use("/books", bookRoutes);
router.use("/users", libraryRoutes);
router.use("/users", libraryRoutes);

// Root route
router.get("/", (req, res) => {
  res.send("Hoşgeldiniz!");
});

// Export the router and sequelize instance
module.exports = { router, database };
