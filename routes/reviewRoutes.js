// routes/reviewRoutes.js
import express from "express";
import {
 addReview,
 getReviewsForBook,
 getReviewById,
 deleteReview,
 updateReviewById,
} from "../controllers/reviewController.js";

const router = express.Router();

// Route pour ajouter un avis
router.post("/", addReview);

// Route pour récupérer les avis d'un livre
router.get("/bookid/:bookId", getReviewsForBook);

// Route pour récupérer un avis spécifique par ID
router.get("/id/:reviewId", getReviewById);

// Route pour mettre à jour un avis spécifique par ID
router.put("/id/:reviewId", updateReviewById);

// Route pour supprimer un avis
router.delete("/id/:reviewId", deleteReview);

export default router;
