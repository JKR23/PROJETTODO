import express from "express"; // Utilisation de l'import ES6
import {
 createStatus,
 getAllStatuses,
 getStatusById,
 updateStatus,
 deleteStatus,
} from "../controllers/statusController.js"; // Importation des méthodes du contrôleur des statuts

const router = express.Router();

// Créer un statut
// URL : http://localhost:5000/api/status
router.post("/", createStatus);

// Récupérer tous les statuts
// URL : http://localhost:5000/api/status
router.get("/", getAllStatuses);

// Récupérer un statut par son ID
// URL : http://localhost:5000/api/status/:id
router.get("/:id", getStatusById);

// Mettre à jour un statut par son ID
// URL : http://localhost:5000/api/status/:id
router.put("/:id", updateStatus);

// Supprimer un statut par son ID
// URL : http://localhost:5000/api/status/:id
router.delete("/:id", deleteStatus);

export default router; // Exportation du router avec la syntaxe ES6
