import express from "express";
import {
 registerUser,
 getAllUsers,
 getUserById,
 updateUser,
 deleteUser,
} from "../controllers/userController.js";
import passport from "passport";
import "../authentification.js"; // Importer la configuration de Passport

const router = express.Router();

// Initialiser Passport
router.use(passport.initialize());
router.use(passport.session());

// Route pour inscrire un utilisateur
router.post("/register", registerUser);

// Récupérer tous les utilisateurs
router.get("/", getAllUsers);

// Récupérer un utilisateur par son ID
router.get("/:id", getUserById);

// Mettre à jour un utilisateur par son ID
router.put("/:id", updateUser);

// Supprimer un utilisateur par son ID
router.delete("/:id", deleteUser);

// Route pour la connexion de l'utilisateur
router.post("/login", (req, res, next) => {
 passport.authenticate("local", (err, user, info) => {
  if (err) {
   return next(err);
  }
  if (!user) {
   return res.status(401).json(info);
  }
  req.logIn(user, (err) => {
   if (err) {
    return next(err);
   }
   if (!req.session.user) {
    req.session.user = user;
   }
   return res.status(200).json({ message: "Connexion réussie", user });
  });
 })(req, res, next);
});

// Route pour la déconnexion de l'utilisateur
router.post("/logout", (req, res) => {
 req.logOut((err) => {
  if (err) {
   return next(err);
  }
  res.redirect("/");
 });
});

export default router;
