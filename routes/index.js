const router = require("express").Router();
const homeRoutes = require("./homeRoutes");
const userRoutes = require("./userRoutes");
const errorRoutes = require("./errorRoutes");
const storyRoutes = require("./storyRoutes");
const welcomeRoute = require("./welcomeRoute");
const apiRoutes = require("./apiRoutes");

router.use("/users", userRoutes);
router.use("/home", homeRoutes);
router.use("/stories", storyRoutes);
router.use("/api", apiRoutes);
router.use("/", welcomeRoute);
router.use("/", errorRoutes);

module.exports = router;
