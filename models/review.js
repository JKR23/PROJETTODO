// models/reviewModel.js
import { prisma } from "../prismaClient.js"; // Import du client Prisma

// Ajouter un avis
const addReview = async (userId, bookId, rating, comment) => {
 console.log("Ajout d'un avis pour le livre avec ID:", bookId);
 try {
  const review = await prisma.review.create({
   data: {
    userId,
    bookId,
    rating,
    comment,
   },
  });
  console.log("Avis ajouté:", review);
  return review;
 } catch (error) {
  console.error("Erreur lors de l'ajout de l'avis:", error);
  throw error;
 }
};

// Obtenir les avis pour un livre donné
const getReviewsForBook = async (bookId) => {
 console.log("Recherche des avis pour le livre avec ID:", bookId);
 try {
  const reviews = await prisma.review.findMany({
   where: { bookId },
  });
  console.log("Avis trouvés pour le livre:", reviews);
  return reviews;
 } catch (error) {
  console.error("Erreur lors de la récupération des avis:", error);
  throw error;
 }
};

// Obtenir un avis spécifique par son ID
const getReviewById = async (reviewId) => {
 console.log("Recherche de l'avis avec l'ID:", reviewId);
 try {
  const review = await prisma.review.findUnique({
   where: { id: reviewId },
  });
  console.log("Avis trouvé:", review);
  return review;
 } catch (error) {
  console.error("Erreur lors de la récupération de l'avis:", error);
  throw error;
 }
};

// Mettre à jour un avis spécifique par son ID
const updateReviewById = async (reviewId, rating, comment) => {
 console.log("Mise à jour de l'avis avec l'ID :", reviewId);
 try {
  const updatedReview = await prisma.review.update({
   where: { id: parseInt(reviewId, 10) },
   data: {
    rating,
    comment,
   },
  });
  console.log("Avis mis à jour :", updatedReview);
  return updatedReview;
 } catch (error) {
  console.error("Erreur lors de la mise à jour de l'avis:", error);
  throw error;
 }
};

// Supprimer un avis par son ID
const deleteReview = async (reviewId) => {
 console.log("Suppression de l'avis avec l'ID:", reviewId);
 try {
  const review = await prisma.review.delete({
   where: { id: reviewId }, // Assurez-vous que l'ID est un entier
  });
  console.log("Avis supprimé:", review);
  return review;
 } catch (error) {
  console.error("Erreur lors de la suppression de l'avis:", error);
  throw error;
 }
};

// Exporter les fonctions avec export default
export default {
 addReview,
 getReviewsForBook,
 getReviewById,
 deleteReview,
 updateReviewById,
};
