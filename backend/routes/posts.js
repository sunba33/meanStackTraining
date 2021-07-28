const express = require("express");

const Post = require("../models/post");

const router = express.Router();

router.post("", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  post.save().then((result) => {
    console.log(result);
    res.status(201).json({
      message: "Post Added Successfully...",
      id: result._id,
    });
  });
});

router.get("", (req, res, next) => {
  Post.find()
    .then((documents) => {
      console.log(documents);
      res
        .status(200)
        .json({ message: "postFetch succesfully!!", posts: documents });
    })
    .catch();
});

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then((post) => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "post not found" });
    }
  });
});

router.put("/:id", (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
  });
  console.log(req.body.content);
  Post.updateOne({ _id: req.params.id }, post).then((result) => {
    console.log(result);
    res.status(200).json({ message: "update success" });
  });
});

router.delete("/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(result);
    res.status(200).json({ message: "Post Deleted!" });
  });
});

module.exports = router;
