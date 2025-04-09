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
import bcrypt from "bcrypt";
import passport from "passport";
import session from "express-session";
import memorystore from "memorystore";
import { createUser, getUserByEmail } from "./models/user.js";

// Initialisation de passport
import "./authentification.js";

// Création du serveur express
const app = express();

// Configuration du moteur de template
app.engine("handlebars", engine({
  helpers: {
    // Fonction pour obtenir les initiales du nom d'utilisateur
    initials: function(options) {
      if (options.data.root.user) {
        const username = options.data.root.user.username;
        return username.charAt(0).toUpperCase();
      }
      return '';
    }
  }
})); 
app.set("view engine", "handlebars");
app.set("views", "./views");

// Middlewares de base
app.use(json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(cors());

// Middleware pour la session
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

// Middleware intégré à Express pour gérer la partie statique du serveur
app.use(express.static("public"));

// Initialisation de passport
app.use(passport.initialize());
app.use(passport.session());

// Middleware pour rendre l'utilisateur disponible dans tous les templates
app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.isAdmin = req.user && req.user.roleId === 1; // Supposant que roleId=1 est admin
  next();
});

// Middleware pour protéger les routes qui nécessitent une authentification
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/connexion');
};

// Middleware pour protéger les routes admin
const ensureAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.roleId === 1) {
    return next();
  }
  res.status(403).render('error', { 
    titre: 'Accès refusé', 
    styles: ["css/style.css"],
    message: 'Vous n\'avez pas les autorisations nécessaires pour accéder à cette page.'
  });
};

// Définir les routes d'authentification
app.get("/connexion", (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.render("connexion", {
    titre: "Connexion",
    styles: ["css/style.css"],
    scripts: ["./js/connexion.js"]
  });
});

app.post("/connexion", passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/connexion'
}));

app.get("/inscription", (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.render("inscription", {
    titre: "Inscription",
    styles: ["css/style.css"],
    scripts: ["./js/inscription.js"]
  });
});

app.post("/inscription", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    console.log("Tentative d'inscription:", { username, email });
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ 
        message: 'Un utilisateur avec cet email existe déjà' 
      });
    }
    
    // Créer l'utilisateur
    await createUser(username, password, email);
    console.log("Utilisateur créé avec succès");
    
    res.status(201).json({ 
      message: 'Inscription réussie! Vous pouvez maintenant vous connecter.' 
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ 
      message: 'Une erreur est survenue lors de l\'inscription' 
    });
  }
});

app.get("/deconnexion", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Erreur lors de la déconnexion:', err);
      return res.status(500).send('Erreur lors de la déconnexion');
    }
    res.redirect('/connexion');
  });
});

// Ajouter helmet après les routes d'authentification pour éviter les problèmes de CSP
// app.use(helmet(cspOption));

// Routes API
app.use("/api/status", ensureAuthenticated, statusRoutes);
app.use("/api/priority", ensureAuthenticated, priorityRoutes);
app.use("/api/history", ensureAuthenticated, historyRoutes);
app.use("/api/users", ensureAuthenticated, userRoutes);
app.use("/api/task", ensureAuthenticated, taskRoutes);
app.use("/api/roles", ensureAdmin, roleRoutes);

// Routes pages principales
app.get("/", ensureAuthenticated, (req, res) => {
 res.render("index", {
  titre: "TODO App",
  styles: ["css/style.css"],
  scripts: ["./js/main.js", "./js/validation.js"],
 });
});

app.get("/accueil", ensureAuthenticated, (req, res) => {
 res.render("index", {
  titre: "TODO App",
  styles: ["css/style.css"],
  scripts: ["./js/main.js", "./js/validation.js"],
 });
});

app.get("/history", ensureAuthenticated, (req, res) => {
 res.render("history", {
  titre: "Historique",
  styles: ["css/style.css"],
  scripts: ["./js/main.js"],
 });
});

app.get("/status", ensureAuthenticated, (req, res) => {
 res.render("status", {
  titre: "Statuts",
  styles: ["css/style.css"],
  scripts: ["./js/main.js"],
 });
});

app.get("/priority", ensureAuthenticated, (req, res) => {
 res.render("priority", {
  titre: "Priorités",
  styles: ["css/style.css"],
  scripts: ["./js/main.js"],
 });
});

app.get("/role", ensureAdmin, (req, res) => {
 res.render("role", {
  titre: "Gestion des rôles",
  styles: ["css/style.css"],
  scripts: ["./js/main.js"],
 });
});

// Page de profil utilisateur
app.get("/profile", ensureAuthenticated, (req, res) => {
  res.render("profile", {
    titre: "Mon profil",
    styles: ["css/style.css"],
    scripts: ["./js/profile.js"],
  });
});

// Gestion des erreurs 404
app.use((request, response) => {
 console.log(`Route non trouvée : ${request.originalUrl}`);
 
 // Si la route demandée commence par /api, retourner une réponse JSON
 if (request.originalUrl.startsWith('/api')) {
   return response.status(404).json({ error: `${request.originalUrl} Route introuvable.` });
 }
 
 // Sinon, rendre la page d'erreur
 response.status(404).render('error', {
   titre: 'Page introuvable',
   styles: ["css/style.css"],
   message: 'La page que vous avez demandée n\'existe pas.'
 });
});

// Middleware global pour gérer les erreurs serveur
app.use((err, req, res, next) => {
 console.error("Erreur serveur :", err);
 
 // Si la requête est une API, retourner une erreur JSON
 if (req.originalUrl.startsWith('/api')) {
   return res.status(500).json({ error: "Erreur interne du serveur." });
 }
 
 // Sinon, rendre la page d'erreur
 res.status(500).render('error', {
   titre: 'Erreur serveur',
   styles: ["css/style.css"],
   message: 'Une erreur est survenue sur le serveur.'
 });
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
 console.info(` Serveur démarré sur http://localhost:${PORT}`);
});


