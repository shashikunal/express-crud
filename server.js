const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
let app = express();

//**MONGODB Connection */
let db_name = "mongodb://localhost:27017/webspiders";
mongoose.connect(
  db_name,
  { useNewUrlParser: true, useUnifiedTopology: true },
  err => {
    if (err) throw err;
    console.log("successfully database connected");
  }
);

//?middleware function here
//? =================all all Routes Path here =====================
// let post = require("./Routes/post");

//!set default template engine into express app for rendering dynamic templates
app.set("view engine", "handlebars");
app.engine("handlebars", exphbs());
//!views or template engine is for server side rendering

app.use(express.static(__dirname + "/public")); //server static files
app.use(express.static(__dirname + "/node_modules")); //server static files

//parse REQUEST BODY from form
app.use(express.urlencoded({ extended: true })); //encoding form body and parsed data

// override with POST having ?_method=DELETE and POST
app.use(methodOverride("_method"));

//for home page
app.get("/", (req, res) => {
  res.render("./home");
});

//all routes should call here
app.use("/posts", require("./Routes/post"));

let PORT = 2000;
app.listen(PORT, err => {
  if (err) throw err;
  console.log(`my local server is working on port number ${PORT}`);
});
