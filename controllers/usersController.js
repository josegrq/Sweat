const { request } = require("express");
const User = require("../models/user");

module.exports = {
  getWelcomePage: (request, response) => {
    response.render("welcome", { layout: false });
  },
  getSignUpPage: (request, response) => {
    response.render("signup", { layout: false });
  },
  //To be implemented
  signUpUser: (request, response) => {},
  getLoginPage: (request, response) => {
    response.render("login", { layout: false });
  },
  //To be implemented
  signInUser: (request, response) => {},
};
