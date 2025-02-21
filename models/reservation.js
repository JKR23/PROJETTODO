// models/reservation.js
import { prisma } from "../prismaClient.js"; // Import du client Prisma

// Fonction pour créer une réservation
const createReservation = async (userId, bookId, reservedUntil) => {
 console.log(
  "Création de réservation pour l'utilisateur ID:",
  userId,
  "avec le livre ID:",
  bookId,
  "et réservé jusqu'à:",
  reservedUntil
 );

 const reservation = await prisma.reservation.create({
  data: {
   userId,
   bookId,
   reservedAt: new Date(), // La date à laquelle la réservation est faite
   reservedUntil: new Date(reservedUntil), // La date jusqu'à laquelle la réservation est valide
   status: "PENDING", // Par défaut, une réservation est en statut 'RESERVED'
  },
 });

 console.log("Réservation créée :", reservation);
 return reservation;
};

// Fonction pour annuler une réservation
const cancelReservation = async (reservationId) => {
 console.log("Annulation de la réservation ID:", reservationId);

 const reservation = await prisma.reservation.update({
  where: { id: reservationId },
  data: { status: "CANCELED" },
 });

 console.log("Réservation annulée :", reservation);
 return reservation;
};

// Fonction pour annuler une réservation
const deleteReservation = async (reservationId) => {
 console.log(
  "Demande de suppression de la réservation avec ID:",
  reservationId
 );

 try {
  const reservation = await prisma.reservation.delete({
   where: {
    id: reservationId, // Rechercher la réservation avec cet ID
   },
  });

  console.log("Réservation supprimée avec succès :", reservation);
  return reservation;
 } catch (error) {
  console.error(
   "Erreur Prisma lors de la suppression de la réservation :",
   error
  );
  throw error; // Propager l'erreur pour qu'elle soit capturée dans le contrôleur
 }
};

// Fonction pour récupérer les réservations d'un utilisateur
const getUserReservations = async (userId) => {
 console.log("Recherche des réservations pour l'utilisateur avec ID:", userId);

 return await prisma.reservation.findMany({
  where: {
   userId: userId, // Vérification par ID utilisateur
  },
  include: {
   book: true, // Inclure les informations sur le livre
   user: true, // Inclure les informations sur l'utilisateur
  },
 });
};

// Récupérer les réservations par livre (titre)
const getReservationsByBookTitle = async (title) => {
 console.log("Recherche des réservations pour le livre avec le titre:", title);

 try {
  // Requête modifiée sans `mode: "insensitive"`
  const reservations = await prisma.reservation.findMany({
   where: {
    book: {
     title: {
      contains: title.toLowerCase(), // Convertir le titre en minuscule
      // Prisma ne gère pas directement `mode: "insensitive"` dans cette version
     },
    },
   },
   include: {
    book: true,
    user: true, // Inclure l'utilisateur associé à la réservation
   },
  });

  console.log("Réservations trouvées :", reservations);

  return reservations;
 } catch (error) {
  console.error("Erreur Prisma lors de la recherche des réservations :", error);
  throw error; // Propager l'erreur pour qu'elle soit capturée dans le contrôleur
 }
};

// Récupérer les réservations par utilisateur (nom ou email)
const getReservationsByUserName = async (userName) => {
 console.log(
  "Recherche des réservations pour l'utilisateur avec le nom:",
  userName
 );

 try {
  // Recherche dans la base de données
  const reservations = await prisma.reservation.findMany({
   where: {
    user: {
     username: {
      contains: userName,
      // Si vous avez besoin d'une recherche insensible à la casse, vous pouvez essayer :
      // mode: 'insensitive' mais assurez-vous que votre version de Prisma supporte cette fonctionnalité
     },
    },
   },
   include: {
    book: true,
    user: true, // Inclure le livre associé à la réservation
   },
  });

  console.log("Réservations trouvées :", reservations);

  return reservations;
 } catch (error) {
  console.error(
   "Erreur Prisma lors de la recherche des réservations par nom d'utilisateur :",
   error
  );
  throw error; // Propager l'erreur pour qu'elle soit capturée dans le contrôleur
 }
};

// Exporter le modèle avec `export default`
export default {
 createReservation,
 cancelReservation,
 getReservationsByBookTitle,
 getReservationsByUserName,
 getUserReservations,
 deleteReservation,
};
