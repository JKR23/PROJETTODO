// controllers/reviewController.js
import reviewModel from "../models/review.js"; // Import du modèle d'avis

// Ajouter un avis
export const addReview = async (req, res) => {
 const { userId, bookId, rating, comment } = req.body;
 console.log("Données de l'avis reçues :", req.body);

 try {
  // Vérification de la validité des données
  if (!userId || !bookId || !rating || !comment) {
   return res.status(400).json({ error: "Tous les champs sont requis." });
  }

  const review = await reviewModel.addReview(userId, bookId, rating, comment);

  console.log("Avis créé avec succès :", review);
  res.status(201).json(review);
 } catch (error) {
  console.error("Erreur lors de la création de l'avis :", error);
  res.status(500).json({ error: "Erreur lors de la création de l'avis" });
 }
};

// Obtenir les avis d'un livre
export const getReviewsForBook = async (req, res) => {
 const { bookId } = req.params;
 console.log("Demande d'avis pour le livre avec ID :", bookId);

 try {
  // Vérification de la validité de l'ID du livre et conversion en entier
  if (!bookId) {
   return res.status(400).json({ error: "L'ID du livre est requis." });
  }

  // Conversion du bookId en entier
  const bookIdInt = parseInt(bookId, 10);

  // Vérifier si la conversion a échoué
  if (isNaN(bookIdInt)) {
   return res
    .status(400)
    .json({ error: "L'ID du livre doit être un entier valide." });
  }

  const reviews = await reviewModel.getReviewsForBook(bookIdInt);

  if (reviews.length === 0) {
   console.log("Aucun avis trouvé pour ce livre.");
   return res.status(404).json({ error: "Aucun avis trouvé pour ce livre." });
  }

  console.log("Avis trouvés pour le livre :", reviews);
  res.status(200).json(reviews);
 } catch (error) {
  console.error("Erreur lors de la récupération des avis :", error);
  res.status(500).json({ error: "Erreur lors de la récupération des avis" });
 }
};

// Obtenir un avis spécifique par ID
export const getReviewById = async (req, res) => {
 const { reviewId } = req.params;
 console.log("Demande d'avis pour l'ID :", reviewId);

 try {
  // Vérification de la validité de l'ID et conversion en entier
  const reviewIdInt = parseInt(reviewId, 10);

  // Vérifier si la conversion a échoué
  if (isNaN(reviewIdInt)) {
   return res
    .status(400)
    .json({ error: "L'ID de l'avis doit être un entier valide." });
  }

  const review = await reviewModel.getReviewById(reviewIdInt);

  if (!review) {
   console.log("Aucun avis trouvé pour l'ID :", reviewIdInt);
   return res.status(404).json({ error: "Avis non trouvé." });
  }

  console.log("Avis trouvé :", review);
  res.status(200).json(review);
 } catch (error) {
  console.error("Erreur lors de la récupération de l'avis :", error);
  res.status(500).json({ error: "Erreur lors de la récupération de l'avis" });
 }
};

// Mettre à jour un avis spécifique par ID
export const updateReviewById = async (req, res) => {
 const { reviewId } = req.params; // Récupérer l'ID de l'avis à partir des paramètres de l'URL
 const { rating, comment } = req.body; // Récupérer les données à mettre à jour depuis le corps de la requête

 console.log("Mise à jour de l'avis avec l'ID :", reviewId);

 try {
  // Vérification de la validité des données
  if (!rating || !comment) {
   return res
    .status(400)
    .json({ error: "Le rating et le commentaire sont requis." });
  }

  const updatedReview = await reviewModel.updateReviewById(
   reviewId,
   rating,
   comment
  );

  if (!updatedReview) {
   return res.status(404).json({ error: "Avis non trouvé." });
  }

  console.log("Avis mis à jour :", updatedReview);
  res.status(200).json(updatedReview);
 } catch (error) {
  console.error("Erreur lors de la mise à jour de l'avis :", error);
  res.status(500).json({ error: "Erreur lors de la mise à jour de l'avis" });
 }
};

//Fonction pour delete review, reviewId
export const deleteReview = async (req, res) => {
 const { reviewId } = req.params; // Récupérer l'ID de l'avis à partir des paramètres de l'URL
 console.log("Demande de suppression de l'avis avec ID :", reviewId);

 try {
  // Convertir l'ID en entier
  const reviewIdInt = parseInt(reviewId, 10);

  // Vérification si la conversion a échoué
  if (isNaN(reviewIdInt)) {
   return res
    .status(400)
    .json({ error: "L'ID de l'avis doit être un entier valide." });
  }

  const review = await reviewModel.deleteReview(reviewIdInt); // Passer l'ID entier à Prisma

  if (!review) {
   console.log("Avis non trouvé pour l'ID :", reviewIdInt);
   return res.status(404).json({ error: "Avis non trouvé." });
  }

  console.log("Avis supprimé :", review);
  res.status(200).json({ message: "Avis supprimé", review });
 } catch (error) {
  console.error("Erreur lors de la suppression de l'avis :", error);
  res.status(500).json({ error: "Erreur lors de la suppression de l'avis" });
 }
};
