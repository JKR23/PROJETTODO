//routes/bookRoutes.js
import express from "express";
const router = express.Router();
import {
 getBooks,
 getBookById,
 searchBooks,
 updateBook,
 deleteBook,
 addBook,
} from "../controllers/bookController.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

router.get("/", getBooks); // Afficher tous les livres
router.get("/search", searchBooks); // Recherche de livres
router.get("/id/:id", getBookById); // Afficher un livre par ID
router.put("/id/:id", updateBook); // Route PUT pour mettre à jour un livre
router.delete("/id/:id", deleteBook); // Route DELETE pour supprimer un livre
router.post("/", addBook); // Route POST pour ajouter un livre

export default router; // Utiliser l'exportation par défaut
