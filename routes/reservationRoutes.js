// routes/reservationRouter.js
import express from "express";
import {
 createReservation,
 getUserReservations,
 deleteReservation,
 getReservationsByBookTitle,
 getReservationsByUserName,
} from "../controllers/reservationController.js";

const router = express.Router();

// Créer une réservation
router.post("/", createReservation);

// Obtenir toutes les réservations d'un utilisateur
router.get("/id/:userId", getUserReservations);

// Supprimer une réservation
router.delete("/id/:reservationId", deleteReservation);

// Obtenir les réservations par titre de livre
router.get("/by-book", getReservationsByBookTitle);

// Obtenir les réservations par nom d'utilisateur
router.get("/by-user", getReservationsByUserName);

export default router;
