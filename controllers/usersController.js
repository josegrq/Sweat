const { request } = require("express");
const User = require("../models/user");

module.exports = {
  getWelcomePage: (request, response) => {
    response.render("users/welcome", { layout: false });
  },
  //NEW
  getSignUpPage: (request, response) => {
    response.render("users/signup", { layout: false });
  },
  //To be implemented
  //CREATE
  signUpUser: (request, response) => {},

  //LOGIN methods
  getLoginPage: (request, response) => {
    response.render("users/login", { layout: false });
  },
  //To be implemented
  signInUser: (request, response) => {
    response.render("users/login");
  },
  //We get ID from parameters in URL and get the user info
  show: (request, response, next) => {
    console.log(request.params);
    let userId = request.params.id;
    User.findById(userId)
      .then((user) => {
        response.locals.user = user;
        next();
      })
      .catch((error) => {
        console.log(error.message);
        next(error);
      });
  },
  //We display the user info (NOT FORMATTED)
  showView: (request, response) => {
    response.render("users/show");
  },
  authenticate: (request, response, next) => {
    User.findOne({
      email: request.body.email,
    })
      .then((user) => {
        if (
          user != undefined &&
          user.password != null &&
          user.password === request.body.password
        ) {
          console.log("wow");
          response.locals.redirect = `/users/${user._id}`;
          response.locals.user = user;
        } else {
          response.locals.redirect = "/users/login";
        }
        /*if (user != undefined) {
          console.log(user);
          user.comparePassword(request.body.password).then((weHaveAMatch) => {
            if (weHaveAMatch) {
              response.locals.redirect = `/users/$user._id`;
              //request.flash(
              //  `Welcome! ${user.first_name} ${user.last_name} you were logged in.`
              //);
              response.locals.user = user;
              next();
            }
            console.log(weHaveAMatch);
            console.log("No mathc");
          });
        }*/
        //request.locals.flash(
        //  `Oops! Double check your username/email and/or password.`
        //);
        next();
      })
      .catch((error) => {
        console.log(error.message);
        next(error);
      });
  },
  redirectView: (request, response, next) => {
    let newPath = response.locals.redirect;
    if (newPath) {
      response.redirect(newPath);
    }
  },
};
