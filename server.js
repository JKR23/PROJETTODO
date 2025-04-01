import "dotenv/config";

// Importer les routes
import statusRoutes from "./routes/statusRoutes.js";
import priorityRoutes from "./routes/priorityRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js"; // Ajout des routes task
import roleRoutes from "./routes/roleRoutes.js";

// Importation des fichiers et librairies
import { engine } from "express-handlebars";
import express, { json } from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import cspOption from "./csp-options.js";

import session from "express-session";
import memorystore from "memorystore";

import passport from "passport";

import "./authentification.js";

// Création du serveur express
const app = express();
app.engine("handlebars", engine()); //Pour informer express que l'on utilise handlebars
app.set("view engine", "handlebars"); //Pour dire a express que le moteur de rendu est handlebars
app.set("views", "./views"); //Pour dire a express ou se trouvent les vues

// Ajout de middlewares
app.use(helmet(cspOption));
app.use(compression());
app.use(cors());
app.use(json());

//middleware pour la session
const MemoryStore = memorystore(session);
app.use(
 session({
  cookie: { maxAge: 3600000 },
  name: process.env.npm_package_name,
  store: new MemoryStore({ checkPeriod: 3600000 }),
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET,
 })
);

// Ajout de middlewares pour passport
// app.use(session({ ... });
app.use(passport.initialize());
app.use(passport.session());

// Middleware intégré à Express pour gérer la partie statique du serveur
app.use(express.static("public"));

// Ajout des routes
app.use("/api/status", statusRoutes);
app.use("/api/priority", priorityRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/users", userRoutes);
app.use("/api/task", taskRoutes); // Ajout des routes de réservation
app.use("/api/roles", roleRoutes);

//route default
app.get("/", (req, res) => {
 if (!req.session.id_user) {
  req.session.id_user = 123; //simulation d'un id
 }

 res.render("index", {
  titre: "TODO App",
  styles: ["css/style.css"],
  scripts: ["./js/main.js", "./js/validation.js"],
 });
});

app.get("/accueil", (req, res) => {
 res.render("index", {
  titre: "TODO App",
  styles: ["css/style.css"],
  scripts: ["./js/main.js", "./js/validation.js"],
 });
});

app.get("/history", (req, res) => {
 res.render("history", {
  titre: "TODO App",
  styles: ["css/style.css"],
  scripts: ["./js/main.js"],
 });
});

app.get("/status", (req, res) => {
 res.render("status", {
  titre: "TODO App",
  styles: ["css/style.css"],
  scripts: ["./js/main.js"],
 });
});

app.get("/priority", (req, res) => {
 res.render("priority", {
  titre: "TODO App",
  styles: ["css/style.css"],
  scripts: ["./js/main.js"],
 });
});

app.get("/role", (req, res) => {
 res.render("role", {
  titre: "TODO App",
  styles: ["css/style.css"],
  scripts: ["./js/main.js"],
 });
});

// Gestion des erreurs 404
app.use((request, response) => {
 console.log(`Route non trouvée : ${request.originalUrl}`);
 response
  .status(404)
  .json({ error: `${request.originalUrl} Route introuvable.` });
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
 console.info("Serveur démarré :");
 console.info(`http://localhost:${PORT}`);
});
