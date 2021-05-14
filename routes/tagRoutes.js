const router = require("express").Router();
const tagController = require("../controllers/tagController");

router.get("/trending", tagController.index, tagController.indexView);



module.exports = router;