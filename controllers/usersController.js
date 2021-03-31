const { request } = require("express");
const User = require("../models/user");

module.exports = {
  getWelcomePage: (request, response) => {
    response.render("welcome", { layout: false });
  },
  //NEW
  getSignUpPage: (request, response) => {
    response.render("users/signup", { layout: false });
  },
  //To be implemented
  //CREATE
  new: (request, response) =>{
    response.render("users/new");
  },
  create: (request, response) => {
    let newUser = {
      name:{
        first_name: request.body.first_name,
        last_name: request.body.last_name
      },

      username: request.body.username,
      dob: request.body.dob,
      email: request.body.email,
      gender: request.body.gender,

      location: {
        address: request.body.address,
        city: request.body.city,
        state: request.body.state,
        zipCode: request.body.zipCode
      },

      password: request.body.password,
      question: request.body.security_questions.question,
      answer: request.body.security_questions.answer,
      bio: request.body.bio

    };
    User.create(newUser)
    .then(user => {
      res.locals.redirect = "/users/login";
      res.locals.user = user;
      next();
    })
    .catch(error => {
      console.log(`error saving user: ${error.message}`);
      next(error)});
  },

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
          request.flash(
            "success",
            `Welcome! ${user.first_name} ${user.last_name} you were logged in.`
          );
          response.locals.redirect = `/users/${user._id}`;
          response.locals.user = user;
        } else {
          console.log("3");
          response.locals.redirect = "/users/login";
          request.flash(
            "warning",
            "Oops! Double check your username/email and/or password."
          );
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
        console.log("4");
        console.log(error.message);
        console.log("5");

        response.locals.redirect = "/users/login";
        request.flash("error", `User failed to login: ${error.message}.`);
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
