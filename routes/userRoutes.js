import express from "express";
import {
 registerUser,
 getAllUsers,
 getUserById,
 updateUser,
 deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

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

export default router;
