////routes/userRoutes.js

import express from "express";
import {
 registerUser,
 getAllUsers,
 getUserById,
 updateUser,
 deleteUser,
 loginUser,
} from "../controllers/userController.js";

const router = express.Router();

// Route pour inscrire un utilisateur
// URL : http://localhost:5000/api/users/register
router.post("/register", registerUser);

// Récupérer tous les utilisateurs
// URL : http://localhost:5000/api/users
router.get("/", getAllUsers);

// Récupérer un utilisateur par son ID
// URL : http://localhost:5000/api/users/:id
router.get("/:id", getUserById);

// Mettre à jour un utilisateur par son ID
// URL : http://localhost:5000/api/users/:id
router.put("/:id", updateUser);

// Supprimer un utilisateur par son ID
// URL : http://localhost:5000/api/users/:id
router.delete("/:id", deleteUser);

// Route pour la connexion de l'utilisateur
// URL : http://localhost:5000/api/users/login
router.post("/login", loginUser);

export default router;
