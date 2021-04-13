const homeController = require("./controllers/homeController");
const errorController = require("./controllers/errorController");
const usersController = require("./controllers/usersController");
const express = require("express");
const layouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
//const indexRoutes = require("./route/index");
//const userRoutes = require("./route/user");
const methodOverride = require("method-override");

//Flash Messages and Authentication
const session = require("express-session");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const expressValidator = require("express-validator");
const passport = require("passport");
const User = require("./models/user");
const { serializeUser } = require("passport");

//Configurations to using coookie-parser
sess = {
  secret: "My-53cr3t_C0d3",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 4000000,
  },
};
mongoose
  .connect("mongodb://localhost:27017/Sweat", {
    useNewUrlParser: true,
    useFindAndModify: true,
  })
  .then(() => {
    console.log("Connected to DB.");
  })
  .catch((error) => console.log("Unable to connect to DB: ", error));

const app = express();
const router = express.Router();
app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");
router.use(layouts);

//MIDDLEWARE
//PRE-PROCESSING REQUESTS
router.use(express.static("public"));
//We are parsing URL encoded data from the body
app.use(
  express.urlencoded({
    extended: false,
  })
);
//Interpret body and query string data as JSON
router.use(express.json());
router.use(methodOverride("_method", { methods: ["POST", "GET"] }));
router.use(expressValidator());

router.use(cookieParser("My-53cr3t_C0d3"));
router.use(
  session({
    secret: "My-53cr3t_C0d3",
    cookie: {
      maxAge: 4000000,
    },
    resave: false,
    saveUninitialized: false,
  })
);
router.use(flash());

//We use passport and session for messages
router.use(passport.initialize());
router.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//We let passport be in charge of letting us know if user is logged in
router.use((request, response, next) => {
  response.locals.flashMessages = request.flash();
  response.locals.loggedIn = request.isAuthenticated();
  response.locals.currentUser = request.user;
  next();
});

//ROUTES GO HERE
router.get("/", usersController.getWelcomePage);
router.get("/users/signup", usersController.getSignUpPage);
router.post(
  "/users/create",
  usersController.validate,
  usersController.create,
  usersController.redirectView
);
router.get("/users/login", usersController.getLoginPage);
router.post(
  "/users/login",
  usersController.authenticate,
  usersController.redirectView
);
router.get(
  "/users/logout",
  usersController.logout,
  usersController.redirectView
);
router.get("/users/:id/edit", usersController.edit);
router.get("/users/:id/change", usersController.change);
router.put(
  "/users/:id/change",
  usersController.validatePasswordChange,
  usersController.changePassword,
  usersController.redirectView
);
router.put(
  "/users/:id/update",
  usersController.validateUpdate,
  usersController.update,
  usersController.redirectView
);
router.get("/users/:id", usersController.show, usersController.showView);
router.delete(
  "/users/:id/delete",
  usersController.delete,
  usersController.redirectView
);
router.get(
  "/home",
  usersController.isAuthenticated,
  homeController.getHomePage
);

//PAGE ERROR HANDLING
router.use(errorController.logErrors);
router.use(errorController.pageNotFoundError);
router.use(errorController.internalServerError);

app.use("/", router);
app.listen(app.get("port"), () => {
  console.log(`Server is running on port: ${app.get("port")}`);
});
