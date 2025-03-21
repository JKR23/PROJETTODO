//.js/validation.js
const inputText = document.getElementById("title");
const due_date = document.getElementById("due-date");
const errorMsg = document.getElementById("error-msg");
const errorMsgDate = document.getElementById("error-msg-date");

export const validateTitle = (title) => {
 if (!title) {
  errorMsg.innerHTML = "Ce champ est obligatoire";
  return false;
 } else if (title.length < 5) {
  errorMsg.innerHTML = "Veuillez entrer au moins 5 caractères";
  return false;
 } else {
  errorMsg.innerHTML = "";
  return true;
 }
};

// Fonction pour valider la date
export const validateDate = (dateValue) => {
 const currentDate = new Date(); // Date actuelle avec l'heure (complet)

 // On formate la date actuelle au format 'YYYY-MM-DD' pour comparaison
 const currentDateString = currentDate.toISOString().split("T")[0]; // Format 'YYYY-MM-DD'

 // Vérifier si la date est vide
 if (!dateValue) {
  errorMsgDate.innerHTML = "La date est obligatoire."; // Message d'erreur si la date est vide
  return false; // Retourner faux si la validation échoue
 }

 // Vérifier si la date est inférieure à la date actuelle
 if (dateValue < currentDateString) {
  errorMsgDate.innerHTML =
   "La date doit être égale ou supérieure à aujourd'hui."; // Message d'erreur si la date est invalide
  return false; // Retourner faux si la validation échoue
 }

 // Si toutes les conditions sont remplies
 errorMsgDate.innerHTML = ""; // Supprimer le message d'erreur
 return true; // Retourner vrai si la validation réussit
};
