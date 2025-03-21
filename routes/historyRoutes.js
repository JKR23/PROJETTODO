//routes/historyRoutes.js
import express from "express";
import {
 createHistory,
 getHistoryByTaskId,
 getHistories, // Importer la méthode getHistories
} from "../controllers/historyController.js";

const router = express.Router();

// Créer un historique pour une tâche
// URL : http://localhost:5000/api/history
router.post("/", createHistory);

// Récupérer tous les historiques
// URL : http://localhost:5000/api/history
router.get("/", getHistories); // Route pour récupérer tous les historiques

// Récupérer l'historique d'une tâche spécifique par son ID
// URL : http://localhost:5000/api/history/task/:taskId
router.get("/task/:taskId", getHistoryByTaskId);

export default router; // Exportation du router avec la syntaxe ES6
