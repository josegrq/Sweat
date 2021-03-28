const homeController = require("./controllers/homeController");
const errorController = require("./controllers/errorController");
const usersController = require("./controllers/usersController");
const express = require("express");
const layouts = require("express-ejs-layouts");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/Sweat", {
  useNewUrlParser: true,
});

const app = express();

app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");
app.use(layouts);

app.get("/", usersController.getWelcomePage);
app.get("/signup", usersController.getSignUpPage);
app.get("/login", usersController.getLoginPage);

//MIDDLEWARE
//PRE-PROCESSING REQUESTS
app.use(express.static("public"));

//We are parsing URL encoded data from the body
app.use(
  express.urlencoded({
    extended: false,
  })
);
//Interpret body and query string data as JSON
app.use(express.json());

//ROUTES GO HERE

//PAGE ERROR HANDLING
app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);

app.listen(app.get("port"), () => {
  console.log(`Server is running on port: ${app.get("port")}`);
});
