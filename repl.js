const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/recipe_dp", {useNewUrlParser: true});

mongoose.Promise = global.Promise;

const Subscriber = require ("./models/subscriber");
const Course = require("./models/course");
const User = require("./models/user");
