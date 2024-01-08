const controller = require("../controllers/userController"); //kind the role of middleware
const router = require("express").Router();
const fbAuth = require("../util/fbAuth");

//making the crud

router
  .get("/", controller.getAllUsers)
  .get("/:id", controller.getOneUser)
  .post("/", fbAuth, controller.createOneUser);
//.put('/users/:id', controller.updateOneUser)
//.delete('/users/:id', controller.deleteOneUser)

module.exports = router;
