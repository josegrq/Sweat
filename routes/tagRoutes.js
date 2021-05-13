const router = require("express").Router();
const tagController = require("../controllers/tagController");

router.get("/:id/trending", tagController.index, tagController.indexView);

module.exports = router;