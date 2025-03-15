//routes/priorityRoutes.js

import express from "express"; // Utilisation de l'import ES6
import {
 createPriority,
 getAllPriorities,
 getPriorityById,
 updatePriority,
 deletePriority,
} from "../controllers/priorityController.js"; // Importation des méthodes du contrôleur des priorités

const router = express.Router();

// Créer une priorité
// URL : http://localhost:5000/api/priority
router.post("/", createPriority);

// Récupérer toutes les priorités
// URL : http://localhost:5000/api/priority
router.get("/", getAllPriorities);

// Récupérer une priorité par son ID
// URL : http://localhost:5000/api/priority/:id
router.get("/:id", getPriorityById);

// Mettre à jour une priorité par son ID
// URL : http://localhost:5000/api/priority/:id
router.put("/:id", updatePriority);

// Supprimer une priorité par son ID
// URL : http://localhost:5000/api/priority/:id
router.delete("/:id", deletePriority);

export default router; // Exportation du router avec la syntaxe ES6
