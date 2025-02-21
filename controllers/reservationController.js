// controllers/reservationController.js
import reservationModel from "../models/reservation.js"; // Import du modèle de réservation

// Créer une réservation
export const createReservation = async (req, res) => {
 try {
  const { bookId, userId, reservedUntil } = req.body;

  // Log des paramètres pour vérifier la réception de la requête
  console.log("Données de réservation reçues :", req.body);

  // Vérification de la date
  if (!reservedUntil) {
   return res
    .status(400)
    .json({ error: "La date de réservation est requise." });
  }

  // Création de la réservation avec la date réservée et réservée jusqu'à
  const reservation = await reservationModel.createReservation(
   userId,
   bookId,
   reservedUntil
  );

  // Log de la réponse
  console.log("Réservation créée :", reservation);

  res.status(201).json(reservation);
 } catch (error) {
  console.error("Erreur lors de la création de la réservation :", error);
  res
   .status(500)
   .json({ error: "Erreur lors de la création de la réservation" });
 }
};

// Obtenir les réservations d'un utilisateur
export const getUserReservations = async (req, res) => {
 const { userId } = req.params;

 // Log de l'ID utilisateur reçu
 console.log("Demande de réservations pour l'utilisateur avec ID :", userId);

 try {
  // Convertir userId en entier
  const userIdInt = parseInt(userId, 10);

  // Vérifier si la conversion a réussi
  if (isNaN(userIdInt)) {
   return res
    .status(400)
    .json({ error: "L'ID utilisateur doit être un nombre valide." });
  }

  const reservations = await reservationModel.getUserReservations(userIdInt);

  // Log des réservations récupérées
  console.log(
   "Réservations récupérées pour l'utilisateur",
   userIdInt,
   ":",
   reservations
  );

  // Vérifier si des réservations ont été trouvées
  if (!reservations || reservations.length === 0) {
   console.log("Aucune réservation trouvée pour cet utilisateur.");
   return res
    .status(404)
    .json({ error: "Aucune réservation trouvée pour cet utilisateur." });
  }

  res.status(200).json(reservations);
 } catch (error) {
  console.error("Erreur lors de la récupération des réservations :", error);
  res
   .status(500)
   .json({ error: "Erreur lors de la récupération des réservations" });
 }
};

// Supprimer une réservation
export const deleteReservation = async (req, res) => {
 const { reservationId } = req.params;
 console.log(
  "Demande de suppression de la réservation avec ID:",
  reservationId
 );

 try {
  // Vérifier si l'ID de réservation est valide
  if (!reservationId) {
   console.log("ID de réservation manquant.");
   return res.status(400).json({ error: "L'ID de réservation est requis." });
  }

  // Convertir l'ID de réservation en entier
  const reservationIdInt = parseInt(reservationId, 10);
  if (isNaN(reservationIdInt)) {
   console.log("ID de réservation invalide:", reservationId);
   return res
    .status(400)
    .json({ error: "L'ID de réservation doit être un nombre valide." });
  }

  console.log("Suppression de la réservation avec ID:", reservationIdInt);
  const reservation = await reservationModel.deleteReservation(
   reservationIdInt
  );

  // Si aucune réservation n'a été trouvée, retour d'une erreur
  if (!reservation) {
   console.log("Aucune réservation trouvée pour l'ID:", reservationIdInt);
   return res.status(404).json({ error: "Réservation non trouvée." });
  }

  console.log("Réservation supprimée:", reservation);
  res.status(200).json({ message: "Réservation supprimée", reservation });
 } catch (error) {
  console.error("Erreur lors de la suppression de la réservation:", error);
  res
   .status(500)
   .json({ error: "Erreur lors de la suppression de la réservation" });
 }
};

// Obtenir les réservations par titre de livre
export const getReservationsByBookTitle = async (req, res) => {
 const { title } = req.query; // Utiliser req.query pour récupérer le paramètre de titre
 try {
  console.log("Recherche des réservations pour le livre avec le titre:", title);

  if (!title) {
   console.log("Aucun titre de livre fourni.");
   return res.status(400).json({ error: "Le titre du livre est requis." });
  }

  console.log("Titre du livre reçu:", title);

  const reservations = await reservationModel.getReservationsByBookTitle(title);

  console.log("Réservations trouvées pour le livre :", reservations);

  if (reservations.length === 0) {
   console.log("Aucune réservation trouvée pour ce livre.");
   return res
    .status(404)
    .json({ error: "Aucune réservation trouvée pour ce livre." });
  }

  res.status(200).json(reservations);
 } catch (error) {
  console.error(
   "Erreur lors de la recherche des réservations par titre de livre:",
   error
  );
  res.status(500).json({
   error: "Erreur lors de la recherche des réservations par titre de livre",
  });
 }
};

// Obtenir les réservations par nom d'utilisateur
export const getReservationsByUserName = async (req, res) => {
 const { username } = req.query; // Utiliser req.query pour récupérer le paramètre de nom d'utilisateur
 console.log(
  "Demande de réservations pour l'utilisateur avec le nom d'utilisateur :",
  username
 );

 try {
  if (!username) {
   console.log("Le nom d'utilisateur est manquant.");
   return res.status(400).json({ error: "Le nom d'utilisateur est requis." });
  }

  console.log(
   "Recherche des réservations pour l'utilisateur avec le nom:",
   username
  );
  const reservations = await reservationModel.getReservationsByUserName(
   username
  );

  // Vérifier si des réservations ont été trouvées
  if (reservations.length === 0) {
   console.log("Aucune réservation trouvée pour cet utilisateur.");
   return res
    .status(404)
    .json({ error: "Aucune réservation trouvée pour cet utilisateur." });
  }

  console.log("Réservations trouvées :", reservations);
  res.status(200).json(reservations);
 } catch (error) {
  console.error(
   "Erreur lors de la recherche des réservations par utilisateur:",
   error
  );
  res.status(500).json({
   error: "Erreur lors de la recherche des réservations par utilisateur",
  });
 }
};
