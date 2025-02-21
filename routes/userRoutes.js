// src/routes/userRoutes.js
import express from "express"; // Utilisation de l'import ES6
import {
 registerUser,
 loginUser,
 getUserByEmail,
 getAllUsers,
 getUserById,
 updateUser,
 deleteUser,
} from "../controllers/userController.js"; // Utilisation de l'import ES6 pour les contrôleurs

const router = express.Router();

// Inscription d'un utilisateur
router.post("/register", registerUser);

// Connexion d'un utilisateur
router.post("/login", loginUser);

// Récupérer tous les utilisateurs
router.get("/", getAllUsers);

// récupérer un utilisateur par son ID
router.get("/:id", getUserById);

// Récupérer un utilisateur par son email
router.get("/:email", getUserByEmail);

// Mettre à jour un utilisateur par son ID
router.put("/id/:id", updateUser);

//Supprimer un utilisateur par son ID
router.delete("/id/:id", deleteUser);

export default router; // Exportation du router avec la syntaxe ES6
