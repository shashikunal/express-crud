const express = require("express");
const mongoose = require("mongoose");
let router = express.Router();

/*------------imported POST Schema -----------------*/
require("../Model/Post");
let POST = mongoose.model("posts");
/*------------end POST Schema -----------------*


/**START @ALL GET ROUTES *****/
router.get("/create-post", (req, res) => {
  res.render("posts/CreatePost");
});
router.get("/edit-post", (req, res) => {
  res.render("posts/EditPost");
});

router.get("/fetch-post", (req, res) => {
  POST.find({})
    .lean()
    .then(posts => {
      res.render("posts/FetchPost", { posts });
    })
    .catch(err => console.log(err));
});

//fetch Single Route for edit
router.get("/edit-post/:id", (req, res) => {
  POST.findOne({ _id: req.params.id })
    .lean()
    .then(editPost => {
      res.render("posts/EditPost", { editPost });
    })
    .catch(err => console.log(err));
});

/**END OF @ALL GET ROUTES *****/

/**START @ALL POST ROUTES *****/
//for creating new DATA purpose HTTP POST method
// if POST Request should provide  url , body(payload || data)
router.post("/create-post", (req, res) => {
  //form body
  let { title, details } = req.body;
  //if FORM DATA IS EMPTY SHOULD GET ERRORS DISPLAY ON PAGE
  //if form is empty dont give form submission
  let Errors = [];
  if (!title) {
    Errors.push({ text: "Title is Required" });
  }
  if (!details) {
    Errors.push({ text: "Details is Required" });
  }

  if (Errors.length > 0) {
    res.render("posts/CreatePost", { errors: Errors }); //ending req , res cycle
    console.log(Errors);
  } else {
    //submit
    let newPost = { title, details };

    //save this form body to database
    new POST(newPost)
      .save()
      .then(post => {
        console.log(post);
        res.redirect("/posts/fetch-post", 301, () => {});
      })
      .catch(err => console.log(err));
  }
});

/**ENDS @ALL POST ROUTES *****/

/**STARTS @ALL PUT ROUTES *****/
router.put("/edit-post/:id", (req, res) => {
  POST.findOne({ _id: req.params.id })
    .then(editPost => {
      editPost.title = req.body.title;
      editPost.details = req.body.details;
      //should save new updated data into database
      editPost
        .save()
        .then(_ => {
          res.redirect("/posts/fetch-post", 301, () => {});
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
});

/**ENDS @ALL PUT ROUTES *****/

/**STARTS DELETE ROUTE HERE */
router.delete("/delete-post/:id", (req, res) => {
  POST.remove({ _id: req.params.id })
    .then(_ => {
      res.redirect("/posts/fetch-post", 301, () => {});
    })
    .catch(err => console.log(err));
});
/* ENDS DELETE ROUTE HERE -----*/

module.exports = router;
