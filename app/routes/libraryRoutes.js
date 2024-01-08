const controller = require("../controllers/libraryController"); //kind the role of middleware
const router = require("express").Router();
const fbAuth = require("../util/fbAuth");

//making the crud

router
  .post("/:userId/borrow/:bookId", controller.borrowBook) //borrow book
  .post("/:userId/return/:bookId", fbAuth, controller.return_scoreBook); //return book

module.exports = router;
