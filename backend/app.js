const express = require("express");
const bodyparser = require("body-parser");
const postsRoutes = require("./routes/posts");
const mongoose = require("mongoose");

const app = express();

mongoose
  .connect(
    "mongodb+srv://deniz:X8Pu9DVuAIcBWUhw@cluster0.cqt4s.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("connected");
  })
  .catch(() => {
    console.log("error");
  });
app.use(bodyparser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PATCH,DELETE,OPTIONS,PUT"
  );
  next();
});

app.use("/api/posts", postsRoutes);

module.exports = app;
