const { request } = require("express");
const User = require("../models/user");
const passport = require("passport");
const httpStatusCodes = require("http-status-codes");
const getParams = (body) => {
  return {
    name: {
      firstName: body.firstName,
      lastName: body.lastName,
    },
    username: body.username,
    email: body.email,
    gender: body.gender,
    location: {
      street: body.street,
      city: body.city,
      state: body.state,
      zipCode: parseInt(body.zipCode),
    },
    bio: body.bio,
    Stories: request.body.Stories,
  };
};
module.exports = {
  getWelcomePage: (request, response) => {
    response.render("welcome", { layout: false });
  },
  //NEW
  getSignUpPage: (request, response) => {
    response.render("users/signup", { layout: false });
  },
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
      Stories: request.body.Stories,
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
        gmail_remove_dots: false,
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
      .normalizeEmail({
        all_lowercase: true,
        gmail_remove_dots: false,
      })
      .isEmail();
    const confirmPassword = request.body.password;
    request
      .check(
        "password",
        "Password must be at least 8 characters long, have at least one uppercase and lowercase letter, and must include a number."
      )
      .notEmpty()
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/);
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
        let messages = error.array().map((e) => e.msg);
        request.flash("error", messages.join(" and "));
        request.skip = true;
        response.locals.redirect = "/users/signup";
        next();
      } else {
        next();
      }
    });
  },
  validateUpdate: (request, response, next) => {
    const userID = request.params.id;
    request
      .sanitizeBody("email")
      .normalizeEmail({
        all_lowercase: true,
        gmail_remove_dots: false,
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
    request
      .check("email", "Email is not valid")
      .notEmpty()
      .normalizeEmail({ all_lowercase: true, gmail_remove_dots: false })
      .isEmail();
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
    request
      .check("bio", "May only contain letters, numbers and/or spaces")
      .trim()
      .matches(/^[a-zA-Z0-9\s,'-]*$/);
    request.getValidationResult().then((error) => {
      //ERRORS
      if (!error.isEmpty()) {
        let messages = error.array().map((e) => e.msg);
        request.flash("error", messages.join(" and "));
        request.skip = true;
        response.locals.redirect = `/users/${userID}/edit`;
        next();
      } else {
        next();
      }
    });
  },
  update: (request, response, next) => {
    if (request.skip) {
      return next();
    }
    let userId = request.params.id;
    let userParams = getParams(request.body);
    User.findByIdAndUpdate(userId, userParams)
      .then((user) => {
        response.locals.redirect = `/users/${userId}`;
        request.flash("success", "Your account has been successfully updated!");
        response.locals.user = user;
        next();
      })
      .catch((error) => {
        console.log(error);
        next(error);
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
  validatePasswordChange: (request, response, next) => {
    const confirmPassword = request.body.new_password;
    const userId = request.params.id;
    request
      .check(
        "new_password",
        "Password must be at least 8 characters long, have at least one uppercase and lowercase letter, and must include a special character."
      )
      .notEmpty()
      .matches(
        /^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8,}$/
      );
    request
      .check("confirm_new_password", "Passwords are not the same")
      .equals(confirmPassword);

    request.getValidationResult().then((error) => {
      //ERRORS
      if (!error.isEmpty()) {
        let messages = error.array().map((e) => e.msg);
        request.flash("error", messages.join(" and "));
        request.skip = true;
        response.locals.redirect = `/users/${userId}/change`;
        next();
      } else {
        next();
      }
    });
  },
  change: (request, response, next) => {
    let userId = request.params.id;
    User.findById(userId)
      .then((user) => {
        response.render("users/passwordChange", { user: user });
      })
      .catch((error) => {
        console.log(error);
        next(error);
      });
  },
  changePassword: (request, response, next) => {
    if (request.skip) {
      return next();
    }
    let userId = request.params.id;
    User.findById(userId).then((user) => {
      user
        .changePassword(request.body.old_password, request.body.new_password)
        .then((user) => {
          request.flash("success", "Old Password was successfully changed");
          response.locals.redirect = `/users/${userId}`;
          next();
        })
        .catch((error) => {
          request.flash("error", "Old Password was not entered correctly");
          response.locals.redirect = `/users/${userId}/change`;
          next();
        });
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
  getMessagesPage: (request, response) => {
    let userId = request.params.id;
    User.findById(userId)
      .then((user) => {
        User.find({}).then((users) => {
          response.render("chat", { user: user, users: users });
        });
      })
      .catch((error) => {
        next(error);
      });
  },
  connections: (request, response, next) => {
    User.find({})
      .then((users) => {
        response.locals.users = users;
        next();
      })
      .catch((error) => {
        next(error);
      });
  },
  showConnectios: (request, response) => {
    response.render("makeConnections");
  },
  respondJSON: (request, response) => {
    response.json({
      status: httpStatusCodes.OK,
      data: response.locals,
    });
  },
  errorJSON: (error, request, response, next) => {
    let errorObject;
    //We have an error
    if (error) {
      errorObject = {
        status: httpStatusCodes.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    } else {
      errorObject = {
        status: httpStatusCodes.OK,
        message: "Unknown Error",
      };
    }
    response.json(errorObject);
  },
  //This function will add a boolean attribute to users letting us know if current user follows them or not
  filterUsers: (request, response, next) => {
    let listOfUsers;
    User.find({}).then((users) => {
      listOfUsers = users;
      //This is the logged in user
      let currentUser = response.locals.currentUser;
      let mappedUsers = listOfUsers.map((user) => {
        let followingUser = currentUser.Connections.some((userConnection) => {
          return userConnection.equals(user._id);
        });
        return Object.assign(user.toObject(), {
          following: followingUser,
        });
      });
      //We remove our own profile
      for (let index = 0; index < mappedUsers.length; index++) {
        if (mappedUsers[index]._id.equals(currentUser._id)) {
          mappedUsers.splice(index, 1);
          break;
        }
      }
      response.locals.users = mappedUsers;
      next();
    });
  },
  follow: (request, response, next) => {
    //This is user we want to follow/connect to
    let userID = request.params.id;
    let currentUser = request.user;
    User.findByIdAndUpdate(currentUser, {
      $addToSet: {
        Connections: userID,
      },
    })
      .then(() => {
        //Let site know user was added to our connections
        response.locals.success = true;
        next();
      })
      .catch((error) => {
        next(error);
      });
  },
  unfollow: (request, response, next) => {
    //We want to unfollow this user
    let userID = request.params.id;
    //Logged user
    let currentUser = request.user;
    User.findByIdAndUpdate(currentUser, {
      $pull: {
        Connections: userID,
      },
    })
      .then(() => {
        //Let site know user was added to our connections
        response.locals.success = true;
        next();
      })
      .catch((error) => {
        next(error);
      });
  },
  index: (request, response, next) => {
    User.find()
      .then((users) => {
        response.locals.users = users;
        next();
      })
      .catch((error) => {
        console.log(error);
        next(error);
      });
  },
};
