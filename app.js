//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");
const e = require("express");

const homeStartingContent =
  "Post Your Ideas Freely. It's Anonymous ! XD";
const aboutContent =
  "This Website was created with the motive of allowing individuals put up their thoughts freely. Post whatever you have in your mind without the fear of being Judged!";
const contactContent =
  "Mind your own business buddy! Why do even wanna contact the creator? Just Kidding.. XD";

const app = express();

app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

//MongoDB Atlas
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected to Database successfully");
});

//Post Schema
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
});

//model
const Post = new mongoose.model("Post", postSchema);

app.get("/", (req, res) => {
  Post.find({}, function (err, posts) {
    res.render("home", {
      homeCont: homeStartingContent,
      posts: posts,
    });
  });
});
// params
app.get("/posts/:postId", (req, res) => {
  const requestedId = req.params.postId;
  Post.findOne({ _id: requestedId }, function (err, post) {
    if (err) {
      console.log(err);
    } else {
      res.render("post", {
        post: post,
      });
    }
  });
});
app.get("/about", (req, res) => {
  res.render("about", {
    aboutCont: aboutContent,
  });
});
app.get("/contact", (req, res) => {
  res.render("contact", {
    contactCont: contactContent,
  });
});
app.get("/compose", (req, res) => {
  res.render("compose");
});

//posting and saving a new entry
app.post("/compose", (req, res) => {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
  });
  post.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Post saved successfully !");
      res.redirect("/");
    }
  });
});

//PORT

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});
