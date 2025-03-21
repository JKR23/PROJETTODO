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

// Récupérer les tâches par statut
// URL : http://localhost:5000/api/task/status/:status
router.get("/status/:status", getTasksByStatusName);

// Récupérer les tâches par ID de statut
// URL : http://localhost:5000/api/task/statusId/:statusId
router.get("/statusId/:statusId", getTasksByIdStatus);

// Récupérer une tâche par son ID
// URL : http://localhost:5000/api/task/:id
router.get("/:id", getTaskById);

// Mettre à jour une tâche
// URL : http://localhost:5000/api/task/:id
router.put("/:id", updateTask);

// Supprimer une tâche
// URL : http://localhost:5000/api/task/:id
router.delete("/:id", deleteTask);

export default router;
