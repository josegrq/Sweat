const router = require("express").Router();
const usersController = require("../controllers/usersController");

router.get("/", usersController.getWelcomePage);

module.exports = router;
