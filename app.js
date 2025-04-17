const session = require("express-session");
const bcrypt = require("bcrypt");
const User = require("./models/User");


require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Todo = require("./models/Todo");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
  session({
    secret: "monSecretUltraSecret123",
    resave: false,
    saveUninitialized: false,
  })
);


mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/todoListDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/", async (req, res) => {
  const todos = await Todo.find();
  res.render("index", { todoItems: todos });
});

app.post("/", async (req, res) => {
  const todo = new Todo({ name: req.body.newItem });
  await todo.save();
  res.redirect("/");
});

app.post("/delete", async (req, res) => {
  await Todo.findByIdAndDelete(req.body.checkbox);
  res.redirect("/");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server started on port " + port);
});
