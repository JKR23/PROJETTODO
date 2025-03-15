//./js/main.js
import { validateTitle, validateDate } from "./validation.js";

// Récupération des éléments du DOM
const addButton = document.getElementById("add-button"); // Bouton pour ouvrir le modal d'ajout de tâche
const taskModal = document.getElementById("task-modal"); // Modal pour ajouter une tâche
const closeBtn = document.querySelector(".close-btn"); // Bouton pour fermer le modal
const taskForm = document.getElementById("task-form"); // Formulaire d'ajout de tâche
const todoList = document.getElementById("todo-list"); // Liste des tâches "TODO"
const inProgressList = document.getElementById("in-progress-list"); // Liste des tâches "IN PROGRESS"
const inReviewList = document.getElementById("in-review-list"); // Liste des tâches "IN REVIEW"
const doneList = document.getElementById("done-list"); // Liste des tâches "DONE"

// Ouvre le modal d'ajout de tâche quand le bouton "Ajouter une tâche" est cliqué
addButton.addEventListener("click", () => {
 console.log("Bouton Ajouter cliqué");
 taskModal.style.display = "block"; // Affiche le modal
});

// Ferme le modal d'ajout de tâche et réinitialise le formulaire quand le bouton de fermeture est cliqué
closeBtn.addEventListener("click", () => {
 console.log("Fermeture du formulaire d'ajout de tâche");
 taskModal.style.display = "none"; // Cache le modal
 taskForm.reset(); // Réinitialise le formulaire
});

// Fonction pour formater une date au format ISO (YYYY-MM-DD)
const formatDateToISO = (dateString) => {
 const date = new Date(dateString);
 if (isNaN(date.getTime())) {
  // Vérifie si la date est valide
  console.error("Date invalide :", dateString);
  return null; // Retourne null si la date est invalide
 }

 const year = date.getFullYear();
 const month = (date.getMonth() + 1).toString().padStart(2, "0");
 const day = date.getDate().toString().padStart(2, "0");
 return `${year}-${month}-${day}`; // Retourne la date formatée
};

// Crée un élément de tâche dans la liste
const createTaskElement = (task) => {
 const li = document.createElement("li"); // Crée un élément de liste pour la tâche
 const description = document.createElement("span"); // Crée un élément de texte pour la description
 description.classList.add("description");
 description.textContent = task.title; // Ajoute le titre de la tâche comme contenu textuel
 li.appendChild(description); // Ajoute la description à l'élément de tâche

 // Ajoute un événement de clic pour changer le statut de la tâche
 li.addEventListener("click", async () => {
  let newStatus = "";
  // Détermine le nouveau statut de la tâche en fonction de l'état actuel
  if (task.status.name === "DONE") {
   newStatus = "TODO";
  } else if (task.status.name === "TODO") {
   newStatus = "IN_PROGRESS";
  } else if (task.status.name === "IN_PROGRESS") {
   newStatus = "IN_REVIEW";
  } else if (task.status.name === "IN_REVIEW") {
   newStatus = "DONE";
  }

  await updateTaskStatus(task.id, newStatus); // Met à jour le statut de la tâche
 });

 return li; // Retourne l'élément de tâche créé
};

// Met à jour le statut d'une tâche en envoyant une requête PUT au serveur
const updateTaskStatus = async (taskId, newStatus) => {
 try {
  console.log(`Mise à jour du statut de la tâche ${taskId} vers ${newStatus}`);
  await fetch(`http://localhost:5000/api/task/${taskId}`, {
   method: "PUT",
   headers: {
    "Content-Type": "application/json",
   },
   body: JSON.stringify({ status: newStatus }), // Envoie le nouveau statut
  });

  updateTaskList(); // Met à jour l'affichage des tâches après la modification du statut
 } catch (error) {
  console.error("Erreur de mise à jour de statut", error); // Log l'erreur si la requête échoue
 }
};

// Fonction pour récupérer et afficher les tâches dans les bonnes colonnes
const updateTaskList = async () => {
 try {
  const statuses = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"]; // Statuts des tâches à récupérer

  // Vider les colonnes avant de les remplir avec les nouvelles tâches
  todoList.innerHTML = "";
  inProgressList.innerHTML = "";
  inReviewList.innerHTML = "";
  doneList.innerHTML = "";

  for (const status of statuses) {
   const response = await fetch(
    `http://localhost:5000/api/task/status/${status}`
   ); // Récupère les tâches par statut
   if (response.ok) {
    const tasks = await response.json(); // Parse la réponse en JSON
    tasks.forEach((task) => {
     const taskElement = createTaskElement(task); // Crée l'élément de tâche
     // Ajoute l'élément à la bonne colonne en fonction du statut
     switch (task.status.name) {
      case "TODO":
       todoList.appendChild(taskElement);
       break;
      case "IN_PROGRESS":
       inProgressList.appendChild(taskElement);
       break;
      case "IN_REVIEW":
       inReviewList.appendChild(taskElement);
       break;
      case "DONE":
       doneList.appendChild(taskElement);
       break;
      default:
       break;
     }
    });
   } else {
    console.error("Erreur lors de la récupération des tâches"); // Log l'erreur si la requête échoue
   }
  }
 } catch (error) {
  console.error("Erreur lors de la communication avec le serveur : ", error); // Log l'erreur si une erreur réseau se produit
 }
};

// Fonction pour ajouter une nouvelle tâche
// Fonction pour ajouter une nouvelle tâche
taskForm.addEventListener("submit", async (e) => {
 e.preventDefault(); // Empêche le rechargement de la page lors de la soumission du formulaire

 const formData = new FormData(taskForm); // Récupère les données du formulaire
 const title = formData.get("title");
 const dates = formData.get("due-date");

 // Valider le titre et la description
 const isTitleValidResult = validateTitle(title); // Appel de la fonction de validation pour le titre

 if (!isTitleValidResult) {
  // Si l'un des champs est invalide, on empêche la soumission
  console.error("Le titre ou la description est invalide.");
  return; // Empêche la soumission du formulaire
 }

 // Si le titre et la description sont valides, on poursuit avec le reste de la logique

 const dueDate = formatDateToISO(formData.get("due-date")); // Formate la date limite

 const isDateValidResult = validateDate(dueDate); // Appel de la fonction de validation pour la date

 if (!isDateValidResult) {
  console.error("Date invalide ou manquante"); // Log une erreur si la date est invalide
  return;
 }

 // Conversion de la priorité en entier
 const priority = parseInt(formData.get("priority"), 10); // Convertit la priorité en entier
 const userId = parseInt(formData.get("assignee"), 10);
 const statusId = parseInt(formData.get("status"), 10);

 // Assurez-vous de valider que priority et status sont des valeurs correctes
 if (isNaN(priority)) {
  console.error("Priorité invalide : ", formData.get("priority"));
  return;
 }

 if (isNaN(userId)) {
  console.error("userId invalide : ", formData.get("priority"));
  return;
 }

 if (isNaN(statusId)) {
  console.error("status invalide : ", formData.get("status"));
  return;
 }

 const taskData = {
  title: formData.get("title"),
  description: formData.get("description"),
  priorityId: priority, // Utilise l'entier pour la priorité
  statusId: statusId,
  userId: userId,
  deadline: dueDate,
 };

 try {
  const response = await fetch("http://localhost:5000/api/task", {
   method: "POST",
   headers: {
    "Content-Type": "application/json",
   },
   body: JSON.stringify(taskData), // Envoie les données de la tâche au serveur
  });

  if (response.ok) {
   const task = await response.json();
   console.log("Tâche ajoutée : ", task); // Log la tâche ajoutée
   updateTaskList(); // Met à jour la liste des tâches après ajout
   taskModal.style.display = "none"; // Ferme le modal
   taskForm.reset(); // Réinitialise le formulaire
  } else {
   const errorData = await response.json();
   console.error("Erreur lors de l'ajout de la tâche : ", errorData.error); // Log l'erreur si l'ajout échoue
  }
 } catch (error) {
  console.error("Erreur lors de la communication avec le serveur : ", error); // Log l'erreur en cas de problème réseau
 }
});

// Initialiser la liste des tâches lors du chargement de la page
updateTaskList();
