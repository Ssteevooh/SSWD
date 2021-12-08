const express = require('express');
const layouts = require('express-ejs-layouts');
const router = express.Router()
const mongoose = require("mongoose");
const Subscriber = require("./models/subscriber");
const subscriberController = require("./controllers/subscriberController");
const userController = require("./controllers/userController");
const app = express();
const homeController = require('./controllers/homeController');
const errorController = require('./controllers/errorController');
const methodOverride = require("method-override");
const expressSession = require("express-session");
const cookieParser = require("cookie-parser");
const connectFlash = require("connect-flash");
const passport = require("passport");
const User = require("./models/user");
mongoose.Promise = global.Promise;

mongoose.connect("mongodb://localhost:27017/recipe_db",
  { useNewUrlParser: true }
);

const db = mongoose.connection;

db.once("open", (err) => {
  if(err) {
    console.error(err);
  }
  console.log(`Database started`);
});


app.set('port', process.env.PORT || 5006);

app.set('view engine', 'ejs');

router.use(express.static('public'));
router.use(express.urlencoded({
    extended: false
}));
router.use(
  methodOverride("_method", {
    methods: ["POST", "GET"]
  })
);
router.use(express.json());
router.use(cookieParser("secret_passcode"));
router.use(
  expressSession({
    secret: "secret_passcode",
    cookie: {
      maxAge: 4000000
    },
    resave: false,
    saveUninitialized: false
  })
);
router.use(connectFlash());

router.use(passport.initialize());
router.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

router.use((req, res, next) => {
  res.locals.loggedIn = req.isAuthenticated();
  res.locals.currentUser = req.user;
  res.locals.flashMessages = req.flash();
  next();
});

router.use(layouts);

router.get('/', homeController.respondWithName);
router.get('/media', homeController.respondMedia);
router.get("/subscribers", subscriberController.index, subscriberController.indexView);
router.get("/subscribers/new", subscriberController.new);
router.post("/subscribers/create", subscriberController.create, subscriberController.redirectView);
router.get("/subscribers/:id", subscriberController.show, subscriberController.showView);

router.get("/users", userController.index, userController.indexView);
router.get("/users/new", userController.new);
router.post("/users/create", userController.create, userController.redirectView);
router.get("/users/login", userController.login);
router.post("/users/login", userController.authenticate);
router.get("/users/logout", userController.logout, userController.redirectView);
router.get("/users/:id/edit", userController.edit);
router.put("/users/:id/update", userController.update, userController.redirectView);
router.delete("/users/:id/delete", userController.delete, userController.redirectView);
router.get("/users/:id", userController.show, userController.showView);

router.use(errorController.logErrors);
router.use(errorController.errorNoResourceFound);
router.use(errorController.errorInternal);

app.use("/", router);

app.listen(
    app.get('port'),
    () => {console.log(`Server is listening to PORT ${app.get('port')}`)}
);
