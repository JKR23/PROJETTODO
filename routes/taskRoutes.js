////routes/taskRoutes.js

import express from "express"; // Utilisation de l'import ES6
import {
 createTask,
 getTasks,
 getTaskById,
 updateTask,
 deleteTask,
 getTasksByStatusName,
 getTasksByIdStatus, // Importation de la méthode
} from "../controllers/taskController.js"; // Importation des méthodes du contrôleur des tâches

const router = express.Router();

// Créer une tâche
// URL : http://localhost:5000/api/task
router.post("/", createTask);

// Récupérer toutes les tâches de l'utilisateur
// URL : http://localhost:5000/api/task/user/:id
router.get("/", getTasks);

// Récupérer une tâche par son ID
// URL : http://localhost:5000/api/task/:id
router.get("/:id", getTaskById);

// Récupérer les tâches par statut
// URL : http://localhost:5000/api/task/status/:status
router.get("/status/:status", getTasksByStatusName);

// Récupérer les tâches par statut ID
// URL : http://localhost:5000/api/task/status/id/:statusId
router.get("/status/id/:statusId", getTasksByIdStatus); // Nouvelle route ajoutée

// Mettre à jour une tâche par son ID
// URL : http://localhost:5000/api/task/:id
router.put("/:id", updateTask);

// Supprimer une tâche par son ID
// URL : http://localhost:5000/api/task/:id
router.delete("/:id", deleteTask);

export default router; // Exportation du router avec la syntaxe ES6
