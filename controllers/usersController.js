const { request } = require("express");
const User = require("../models/user");
const passport = require("passport");

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
  //new: (request, response, next) => {
  //  response.render("users/new");
  //},
  create: (request, response, next) => {
    if (request.skip) {
      return next();
    }
    let newUser = new User({
      name: {
        firstName: request.body.firstName,
        lastName: request.body.lastName,
      },

      username: request.body.username,
      dob: request.body.dob,
      email: request.body.email,
      gender: request.body.gender,

      location: {
        street: request.body.street,
        city: request.body.city,
        state: request.body.state,
        zipCode: request.body.zipCode,
      },

      password: request.body.password,

      security_questions: {
        question: request.body.question,
        answer: request.body.answer,
      },

      bio: request.body.bio,
    });
    User.register(newUser, request.body.password, (error, user) => {
      if (user) {
        request.flash("success", "Successfully created new account!");
        response.locals.redirect = "/users/login";
        next();
      } else {
        request.flash(
          "error",
          `New user account failed to create: ${error.message}`
        );
        response.locals.redirect = "/users/new";
        next();
      }
    });
  },
  //We validate input from user before we create the user
  validate: (request, response, next) => {
    request
      .sanitizeBody("email")
      .normalizeEmail({
        all_lowercase: true,
      })
      .trim();

    request
      .check("firstName", "Invalid first name (check invalid characters)")
      .trim()
      .notEmpty()
      .isAlpha()
      .isAscii();
    request
      .check("lastName", "Invalid last name (check invalid characters)")
      .trim()
      .notEmpty()
      .isAlpha()
      .isAscii();
    request
      .check("username", "Invalid username (Only letters and/or numbers)")
      .trim()
      .notEmpty()
      .isAlphanumeric();
    request.check("dob", "Invalid DOB").notEmpty().isISO8601().toDate();
    request
      .check("email", "Email is not valid")
      .notEmpty()
      .normalizeEmail()
      .isEmail();
    const confirmPassword = request.body.password;
    request
      .check(
        "password",
        "Password must be at least 8 characters long, have at least one uppercase and lowercase letter, and must include a special character."
      )
      .notEmpty()
      .matches(
        /^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8,}$/
      );
    request
      .check("confirmPassword", "Passwords are not the same")
      .equals(confirmPassword);
    //Not needed
    //request.check("gender", "");
    request.check("street", "Invalid street").matches(/^[a-zA-Z0-9\s,'-]*$/);
    request.check("city", "Invalid City").trim().isAlpha();
    request.check("state", "Invalid state").trim().isAlpha();
    request
      .check("zipCode", "ZIP code is not valid")
      .notEmpty()
      .isInt()
      .isLength({
        min: 5,
        max: 5,
      });
    request.check("answer", "Invalid answer").trim().notEmpty();
    request
      .check("bio", "May only contain letters, numbers and/or spaces")
      .trim()
      .matches(/^[a-zA-Z0-9\s,'-]*$/);
    request.getValidationResult().then((error) => {
      //ERRORS
      if (!error.isEmpty()) {
        console.log("Jose 1");
        let messages = error.array().map((e) => e.msg);
        console.log("ERRORS");
        console.log(error.array());
        request.flash("error", messages.join(" and "));
        request.skip = true;
        response.locals.redirect = "/users/signup";
        console.log("Jose 2");
        next();
      } else {
        console.log("Jose 3");
        next();
      }
    });
  },
  //LOGIN methods
  getLoginPage: (request, response) => {
    response.render("users/login", { layout: false });
  },
  logout: (request, response, next) => {
    request.logout();
    request.flash("success", "You have been logged out.");
    response.locals.redirect = "/";
    next();
  },
  isAuthenticated: (request, response, next) => {
    if (request.isAuthenticated()) {
      console.log("Jose");
      return next();
    }
    response.redirect("/users/login");
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
  edit: (request, response, next) => {
    let userId = request.params.id;
    User.findById(userId)
      .then((user) => {
        response.render("users/edit", { user: user });
      })
      .catch((error) => {
        console.log(error);
        next(error);
      });
  },
  delete: (request, response, next) => {
    let userId = request.params.id;
    User.findByIdAndDelete(userId)
      .then((user) => {
        //You can do something with the deleted user info if you want
        request.logout();
        request.flash("success", "Your account has been DELETED.");
        response.locals.redirect = "/";
        next();
      })
      .catch((error) => {
        console.log(error);
        next(error);
      });
  },
  //We display the user info (NOT FORMATTED)
  showView: (request, response) => {
    response.render("users/show");
  },
  authenticate: passport.authenticate("local", {
    failureRedirect: "/users/login",
    failureFlash: "Unable to login (double check username/password)",
    successRedirect: "/home",
    successFlash: "Successfully logged in!",
  }),
  redirectView: (request, response, next) => {
    let newPath = response.locals.redirect;
    if (newPath) {
      response.redirect(newPath);
    }
  },
};
