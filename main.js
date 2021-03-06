const homeController = require("./controllers/homeController");
const errorController = require("./controllers/errorController");
const storyController = require("./controllers/storyController");
const usersController = require("./controllers/usersController");
const express = require("express");
const layouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
//const indexRoutes = require("./route/index");
//const userRoutes = require("./route/user");
const methodOverride = require("method-override");
//const bodyParser = require('body-parser');
//Flash Messages and Authentication
const session = require("express-session");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const expressValidator = require("express-validator");
const passport = require("passport");
const User = require("./models/user");
const { serializeUser } = require("passport");
var multer = require("multer");

//Configurations to using coookie-parser
sess = {
  secret: "My-53cr3t_C0d3",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 4000000,
  },
};
//Set up connection to DB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/Sweat", {
    useNewUrlParser: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Connected to DB.");
  })
  .catch((error) => console.log("Unable to connect to DB: ", error));

//Setup app
const app = express();
const router = require("./routes/index");

//For real-time messaging
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: [
      "https://blooming-cove-18869.herokuapp.com/",
      "http://localhost:3000",
    ],
  },
});
//Middleware to check username
io.use((socket, next) => {
  const username = socket.handshake;
  console.log(username);
  //const username = socket.handshake.auth.username;
  //if (!username) {
  //  return next(new Error("invalid username"));
  //}
  //added as an attribute of the socket object, in order to be reused later
  //DO NOT OVEWRITE ATTRIBUTES LIKE ID OR HANDSHAKE
  //socket.username = username;
  next();
});
require("./controllers/chatController")(io);

app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");
app.use(layouts);

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
app.use(methodOverride("_method", { methods: ["POST", "GET"] }));
app.use(expressValidator());

app.use(cookieParser("My-53cr3t_C0d3"));
app.use(
  session({
    secret: "My-53cr3t_C0d3",
    cookie: {
      maxAge: 4000000,
    },
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());

//Set up Multer for Storage of posts
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});
var upload = multer({ storage: storage });

//We use passport and session for messages
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//We let passport be in charge of letting us know if user is logged in
app.use((request, response, next) => {
  response.locals.flashMessages = request.flash();
  response.locals.loggedIn = request.isAuthenticated();
  response.locals.currentUser = request.user;
  next();
});

app.use("/", router);
server.listen(app.get("port"), () => {
  console.log(`Server is running on port: ${app.get("port")}`);
});
