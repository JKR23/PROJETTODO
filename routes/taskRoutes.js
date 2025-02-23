// src/routes/taskRoutes.js
import express from "express"; // Utilisation de l'import ES6
import {
 createTask,
 getTasks,
 getTaskById,
 updateTask,
 deleteTask,
 getTasksByStatus,
} from "../controllers/taskController.js"; // Importation des méthodes du contrôleur des tâches

const router = express.Router();

// Créer une tâche
router.post("/", createTask);

// Récupérer toutes les tâches de l'utilisateur
router.get("/", getTasks);

// Récupérer une tâche par son ID
router.get("/:id", getTaskById);

// Récupérer les tâches par statut
router.get("/status/:status", getTasksByStatus);

// Mettre à jour une tâche par son ID
router.put("/:id", updateTask);

// Supprimer une tâche par son ID
router.delete("/:id", deleteTask);

export default router; // Exportation du router avec la syntaxe ES6
