require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const moment = require('moment');
const layouts = require('express-ejs-layouts');
const router = express.Router()
const mongoose = require("mongoose");
const Product = require("./models/product");
const User = require("./models/user");
const productController = require("./controllers/productController");
const userController = require("./controllers/userController");
const homeController = require('./controllers/homeController');
const errorController = require('./controllers/errorController');
const chatController = require('./controllers/chatController');
const methodOverride = require("method-override");
const expressSession = require("express-session");
const cookieParser = require("cookie-parser");
const connectFlash = require("connect-flash");
const passport = require("passport");


mongoose.Promise = global.Promise;

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });

const db = mongoose.connection;

db.once("open", (err) => {
  if(err) {
    console.error(err);
  }
  console.log(`Database started`);
});

app.set('port', process.env.PORT || 3000);

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

io.on('connection', (socket) => {
  console.log('Connected to chat');

  socket.on('chat message', (msg) => {
    const messageDate = moment().format('LT');
    io.emit('chat message', `${messageDate} | ${msg.user} : ${msg.msg}`);
    chatController.saveMessage(msg, messageDate);
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from chat');
  });
});

router.use(layouts);

router.get('/', homeController.respondWithName);
router.get('/media', homeController.respondMedia);

router.get("/products", productController.index, productController.indexView);
router.get("/products/new", productController.new);
router.post("/products/create", productController.create, productController.redirectView);
router.get("/products/search", productController.search, productController.searchView);
router.get("/products/:id/edit", productController.edit);
router.put("/products/:id/update", productController.update, productController.redirectView);
router.delete("/products/:id/delete", productController.delete, productController.redirectView);
router.get("/products/:id", productController.show, productController.showView);

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

router.get("/chat", chatController.index, chatController.indexView);

router.use(errorController.logErrors);
router.use(errorController.errorNoResourceFound);
router.use(errorController.errorInternal);

app.use("/", router);

server.listen(
    app.get('port'),
    () => {console.log(`Server is listening to PORT ${app.get('port')}`)}
);
