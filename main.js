const express = require("express");
const layouts = require("express-ejs-layouts");
const mongoose = require("mongoose");

//Connect to Online DB
mongoose.connect("mongodb://localhost:27017/ConfettiCuisine", {
  useNewUrlParser: true,
});

const app = express();

app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");
app.use(layouts);

app.get("/", homeController.showIndex);

//MIDDLEWARE
//PRE-PROCESSING REQUESTS
app.use(express.static("public"));
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
