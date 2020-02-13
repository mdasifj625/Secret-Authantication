//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require('mongoose-encryption');





const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

//Connect to database

mongoose.connect('mongodb://localhost:27017/userDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});



const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/register", function(req, res) {
  res.render("register");
});



app.get("/submit", function(req, res) {
  res.render("submit");
});

app.post("/register", function(req, res) {
  User.findOne({
    email: req.body.username
  }, function(err, result) {
    if (result != null) {
      console.log("User Exist");
    } else {
      const user = new User({
        email: req.body.username,
        password: req.body.password
      });
      user.save();
      res.render("secrets");
    }
  });


});

app.post("/login", function(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({
    email: username
  }, function(err, result) {
    if (err) {
      console.log(err);
    } else {
      if (result) {
        if (password === result.password) {
          res.render("secrets");
        }
      }
    }
  });
});


app.listen(3030, function() {
  console.log("Server is running");
});
