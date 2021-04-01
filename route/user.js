const { response } = require("express");
const express = require("express");
const router = express.Router();

router.get("/signup", (request, response) => {
  response.render("signup");
});

router.get("/login", (request, response) => {
  response.render("login");
});

//Handle POST
router.post("/create", (request, response, next) => {});
router.post("/login", (request, response, next) => {});
router.get("/logout", (request, response) => {});

module.exports = router;
