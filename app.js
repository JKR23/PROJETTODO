const session = require("express-session");
const bcrypt = require("bcrypt");
const User = require("./models/User");


require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Todo = require("./models/Todo");
const session = require("express-session");
const bcrypt = require("bcrypt");
const User = require("./models/User");

app.use(
  session({
    secret: "monSecretUltraSecret123", // tu peux changer cette chaîne pour la rendre plus sûre
    resave: false,
    saveUninitialized: false,
  })
);

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

// Page d'inscription
app.get("/register", (req, res) => {
  res.render("register");
});

// Traitement du formulaire d'inscription
app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = new User({ email, password: hashedPassword });
    await user.save();
    res.redirect("/login");
  } catch (err) {
    console.error(err);
    res.send("Erreur lors de l'inscription");
  }
});

// Page de connexion
app.get("/login", (req, res) => {
  res.render("login");
});

// Traitement de la connexion
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && await bcrypt.compare(password, user.password)) {
    req.session.userId = user._id;
    res.redirect("/");
  } else {
    res.send("Échec de la connexion");
  }
});
app.get("/", async (req, res) => {
  if (!req.session.userId) {
    return res.redirect("/login");
  }

  const todos = await Todo.find();
  res.render("index", { todoItems: todos });
});


// Déconnexion
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server started on port " + port);
});
