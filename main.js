const homeController = require("./controllers/homeController");
const errorController = require("./controllers/errorController");
const usersController = require("./controllers/usersController");
const express = require("express");
const layouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
mongoose.connect("mongodb://localhost:27017/Sweat", {
  useNewUrlParser: true,
});

const app = express();
const router = express.Router();
app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");
router.use(layouts);

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
//Interpret body and query string data as JSON
router.use(express.json());
router.use(methodOverride("_method", { methods: ["POST", "GET"] }));

//ROUTES GO HERE
router.get("/", usersController.getWelcomePage);
router.get("/signup", usersController.getSignUpPage);
router.get("/login", usersController.getLoginPage);

//PAGE ERROR HANDLING
router.use(errorController.pageNotFoundError);
router.use(errorController.internalServerError);

app.use("/", router);
app.listen(app.get("port"), () => {
  console.log(`Server is running on port: ${app.get("port")}`);
});
