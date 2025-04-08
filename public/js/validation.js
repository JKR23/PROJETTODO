//.js/validation.js
const inputText = document.getElementById("title");
const due_date = document.getElementById("due-date");
const errorMsg = document.getElementById("error-msg");
const errorMsgDate = document.getElementById("error-msg-date");

const inputCourriel = document.getElementById("input-courriel");
const inputMotDePasse = document.getElementById("input-mot-de-passe");
const errorMsgCourriel = document.getElementById("error-msg-couriel");
const errorMsgMdp = document.getElementById("error-msg-mdp");

export const validateTitle = () => {
 if (inputText.validity.valid) {
  errorMsg.innerHTML = "";
  return true;
 } else {
  if (inputText.validity.valueMissing) {
   errorMsg.innerHTML = "Ce champ est obligatoire";
   return false;
  } else {
   if (inputText.validity.tooShort) {
    errorMsg.innerHTML = "Veuillez entrer au moins 5 caractères";
    return false;
   }
  }
 }
};

// Fonction pour valider la date
export const validateDate = () => {
 const currentDate = new Date(); // Date actuelle avec l'heure (complet)

 // On formate la date actuelle au format 'YYYY-MM-DD' pour comparaison
 const currentDateString = currentDate.toISOString().split("T")[0]; // Format 'YYYY-MM-DD'

 // Vérifier si la date est vide
 if (!due_date.value) {
  errorMsgDate.innerHTML = "La date est obligatoire."; // Message d'erreur si la date est vide
  return false; // Retourner faux si la validation échoue
 }

 /*
 // Vérifier si la date est inférieure à la date actuelle
 if (due_date.value < currentDateString) {
  errorMsgDate.innerHTML =
   "La date doit être égale ou supérieure à aujourd'hui."; // Message d'erreur si la date est invalide
  return false; // Retourner faux si la validation échoue
 }*/

 // Si toutes les conditions sont remplies
 errorMsgDate.innerHTML = ""; // Supprimer le message d'erreur
 return true; // Retourner vrai si la validation réussit
};

export const validateCourriel = () => {
 if (inputCourriel.validity.valid) {
  errorMsgCourriel.innerHTML = "";
  return true;
 } else {
  if (inputCourriel.validity.valueMissing) {
   errorMsgCourriel.innerHTML = "Le courriel est obligatoire";
   return false;
  } else if (inputCourriel.validity.typeMismatch) {
   errorMsgCourriel.innerHTML = "Veuillez entrer un courriel valide";
   return false;
  }
 }
};

export const validateMotDePasse = () => {
 if (inputMotDePasse.validity.valid) {
  errorMsgMdp.innerHTML = "";
  return true;
 } else {
  if (inputMotDePasse.validity.valueMissing) {
   errorMsgMdp.innerHTML = "Le mot de passe est obligatoire";
   return false;
  } else if (inputMotDePasse.validity.tooShort) {
   errorMsgMdp.innerHTML = "Veuillez entrer au moins 6 caractères";
   return false;
  }
 }
};
