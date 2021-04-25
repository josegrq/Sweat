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
const timestampMessages = require("./utils/timestampMessages");
const {
  userConnected,
  getCurrentUser,
  userLeft,
  getConnectionsForCurrentUser,
} = require("./utils/connections");

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
  .connect("mongodb://localhost:27017/Sweat", {
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
const io = new Server(server);

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

//ROUTES GO HERE
/*router.get("/", usersController.getWelcomePage);
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
router.get("/users/:id/messages", usersController.getMessagesPage);
router.get(
  "/users/:id/connections",
  usersController.connections,
  usersController.showConnectios
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
);*/

/*//User stories
//router.get("/stories/showFeed", storyController.index, storyController.indexView);
router.get("/stories", storyController.index, storyController.indexView);
router.get("/stories/:id/show", storyController.show, storyController.showView);
router.get(
  "/stories/:id/showFeed",
  storyController.index,
  storyController.indexView
);
router.get("/stories/:id/story", storyController.new);
router.post(
  "/stories/story/create",
  upload.single("image"),
  storyController.create,
  storyController.redirectView
);
//Story updates
router.get("/stories/:id/edit", storyController.edit);
router.put(
  "/stories/:id/update",
  storyController.validateUpdate,
  storyController.update,
  storyController.redirectView
);
//Story delete
router.delete(
  "/stories/:id/delete",
  storyController.delete,
  storyController.redirectView
);*/
//PAGE ERROR HANDLING
//router.use(errorController.logErrors);
//router.use(errorController.pageNotFoundError);
//router.use(errorController.internalServerError);

/**If you want to show status of user conected to Social Media, yoou need to add the scripts of chat.ejs to layout.ejs */
io.on("connection", (socket) => {
  //We will store the current user ID for later use
  let currentUserId;

  //User popped into Messages tab
  socket.on("joined chat", (userId) => {
    //Get the user info to get their email so other users can email them
    User.findById(userId)
      .then((user) => {
        console.log("Here we are");
        //We get userid from request
        currentUserId = userId;
        //Add to array of connected users
        userConnected(userId, user.email);
        //Join user into unique room with their userid
        socket.join(userId);
      })
      .catch((error) => {
        console.log(`ERROR: ${error.message}`);
      });

    //Send to EVERYONE
    //socket.emit("message", "Welcome");

    //Send to everyone, but self
    //socket.broadcast.emit("message", "user joined");

    //Private messages
    socket.on("private message", ({ content, to }) => {
      socket.to(to).emit("private message", {
        content,
        from: userId,
      });
    });
  });
  //for (let [id, socket] of io.of("/").sockets) {
  //  users.push({
  //    userID: id,
  //    username: socket,
  //  });
  //}
  //for (let user of users) {
  //  console.log("JOSE JOS JO J");
  //  console.log(user);
  //}

  //New Chat
  //socket.on("chat", (msg) => {
  //  io.emit("chat", msg);
  //});

  //Disconnected
  socket.on("disconnect", () => {
    console.log("user disconnected");
    userLeft(currentUserId);
  });
});

app.use("/", router);
server.listen(app.get("port"), () => {
  console.log(`Server is running on port: ${app.get("port")}`);
});
