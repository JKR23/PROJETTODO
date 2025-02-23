import express from "express";
import {
 createHistory,
 getHistoryByTaskId,
} from "../controllers/historyController.js";

const router = express.Router();

// Créer un historique pour une tâche
router.post("/", createHistory);

// Récupérer l'historique d'une tâche
router.get("/:taskId", getHistoryByTaskId);

export default router;
