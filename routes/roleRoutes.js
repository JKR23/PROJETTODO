import express from "express";
import {
 createRole,
 getAllRoles,
 getRoleById,
 updateRole,
 deleteRole,
} from "../controllers/roleController.js";

const router = express.Router();

// Route pour créer un rôle
// URL : http://localhost:5000/api/roles
router.post("/", createRole);

// Récupérer tous les rôles
// URL : http://localhost:5000/api/roles
router.get("/", getAllRoles);

// Récupérer un rôle par son ID
// URL : http://localhost:5000/api/roles/:id
router.get("/:id", getRoleById);

// Mettre à jour un rôle par son ID
// URL : http://localhost:5000/api/roles/:id
router.put("/:id", updateRole);

// Supprimer un rôle par son ID
// URL : http://localhost:5000/api/roles/:id
router.delete("/:id", deleteRole);

export default router;
