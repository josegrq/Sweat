const router = require("express").Router();
const homeController = require("../controllers/homeController");
const usersController = require("../controllers/usersController");

router.get("/", usersController.isAuthenticated, homeController.getHomePage);

module.exports = router;
