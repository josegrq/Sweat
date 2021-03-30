const homeController = require("./controllers/homeController");
const errorController = require("./controllers/errorController");
const usersController = require("./controllers/usersController");
const express = require("express");
const layouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
//const indexRoutes = require("./route/index");
//const userRoutes = require("./route/user");
const methodOverride = require("method-override");
//const expressValidator = require("express-validator");

//Authentication
const session = require("express-session");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");

sess = {
  secret: "MyS3cretPwrd",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 4000000,
    secure: true,
  },
};
mongoose
  .connect("mongodb://localhost:27017/Sweat", {
    useNewUrlParser: true,
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
router.use(cookieParser("secret_passcode"));

/*
app.get("/", usersController.getWelcomePage);
app.get("/signup", usersController.getSignUpPage);
app.get("/login", usersController.getLoginPage);*/

//MIDDLEWARE
//PRE-PROCESSING REQUESTS
router.use(express.static("public"));

//We are parsing URL encoded data from the body
app.use(
  express.urlencoded({
    extended: false,
  })
);
router.use(flash());
router.use(session(sess));

router.use((request, response, next) => {
  response.locals.flashMessages = request.flash();
  next();
});
//Interpret body and query string data as JSON
router.use(express.json());
router.use(methodOverride("_method", { methods: ["POST", "GET"] }));
//router.use(expressValidator());

//ROUTES GO HERE
router.get("/users", usersController.getWelcomePage);
router.get("/users/signup", usersController.getSignUpPage);
router.get("/users/login", usersController.getLoginPage);
router.post(
  "/users/login",
  usersController.authenticate,
  usersController.redirectView
);
router.get("/users/:id", usersController.show, usersController.showView);
//app.use("/", indexRoutes);
//app.use("/users", userRoutes);

//PAGE ERROR HANDLING
router.use(errorController.pageNotFoundError);
router.use(errorController.internalServerError);

app.use("/", router);
app.listen(app.get("port"), () => {
  console.log(`Server is running on port: ${app.get("port")}`);
});
