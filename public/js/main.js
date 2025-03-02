// Sélection des éléments du DOM
const addButton = document.getElementById("add-button");
const taskModal = document.getElementById("task-modal");
const closeBtn = document.querySelector(".close-btn");
const taskForm = document.getElementById("task-form");
const todoList = document.getElementById("todo-list");
const inProgressList = document.getElementById("in-progress-list");
const inReviewList = document.getElementById("in-review-list");
const doneList = document.getElementById("done-list");

// Ouverture et fermeture du modal
addButton.addEventListener("click", () => {
 console.log("Bouton Ajouter cliqué");
 taskModal.style.display = "block";
});

closeBtn.addEventListener("click", () => {
 console.log("fermeture form d'ajout tache");
 taskModal.style.display = "none";
 taskForm.reset(); // Réinitialiser le formulaire lors de la fermeture du modal
});

// Fonction pour formater la date en ISO (yyyy-mm-dd)
const formatDateToISO = (dateString) => {
 const date = new Date(dateString);
 if (isNaN(date.getTime())) {
  // Vérifie si la date est invalide
  console.error("Date invalide :", dateString);
  return null; // Retourne null si la date est invalide
 }

 // Formater la date en ISO : 'yyyy-mm-dd'
 const year = date.getFullYear();
 const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Mois commence à 0
 const day = date.getDate().toString().padStart(2, "0");
 return `${year}-${month}-${day}`;
};

// Fonction pour créer un élément de tâche
const createTaskElement = (task) => {
 const li = document.createElement("li");
 const description = document.createElement("span");
 description.classList.add("description");
 description.textContent = task.title;
 li.appendChild(description);

 // Ajouter un événement pour changer le statut de la tâche
 li.addEventListener("click", async () => {
  let newStatus = "";
  if (task.status === "DONE") {
   newStatus = "TODO";
  } else if (task.status === "TODO") {
   newStatus = "IN_PROGRESS";
  } else if (task.status === "IN_PROGRESS") {
   newStatus = "IN_REVIEW"; // Nouveau statut "IN_REVIEW"
  } else if (task.status === "IN_REVIEW") {
   newStatus = "DONE";
  }

  await updateTaskStatus(task.id, newStatus);
 });

 return li;
};

// Fonction pour mettre à jour le statut de la tâche
const updateTaskStatus = async (taskId, newStatus) => {
 try {
  await fetch(`http://localhost:5000/api/task/${taskId}`, {
   method: "PUT",
   headers: {
    "Content-Type": "application/json",
   },
   body: JSON.stringify({ status: newStatus }),
  });

  // Rafraîchir la liste des tâches après mise à jour
  updateTaskList();
 } catch (error) {
  console.error("Erreur de mise à jour de statut", error);
 }
};

// Fonction pour afficher les tâches
const updateTaskList = async () => {
 try {
  const response = await fetch("http://localhost:5000/api/task");
  if (response.ok) {
   const tasks = await response.json();

   // Effacer les anciennes tâches
   todoList.innerHTML = "";
   inProgressList.innerHTML = "";
   inReviewList.innerHTML = ""; // Nouvelle liste pour "IN_REVIEW"
   doneList.innerHTML = "";

   tasks.forEach((task) => {
    const taskElement = createTaskElement(task);
    switch (task.status) {
     case "TODO":
      todoList.appendChild(taskElement);
      break;
     case "IN_PROGRESS":
      inProgressList.appendChild(taskElement);
      break;
     case "IN_REVIEW": // Nouvelle colonne "IN_REVIEW"
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
   console.error("Erreur lors de la récupération des tâches");
  }
 } catch (error) {
  console.error("Erreur lors de la communication avec le serveur : ", error);
 }
};

// Fonction pour créer une nouvelle tâche
taskForm.addEventListener("submit", async (e) => {
 e.preventDefault(); // Empêcher l'envoi du formulaire

 const formData = new FormData(taskForm);
 const dueDate = formatDateToISO(formData.get("due-date"));

 // Vérifie si la date est valide avant de procéder
 if (!dueDate) {
  console.error("Date invalide ou manquante");
  return; // Ne pas envoyer la tâche si la date est invalide ou vide
 }

 const taskData = {
  title: formData.get("title"),
  description: formData.get("description"),
  priority: formData.get("priority"),
  deadline: dueDate, // Utiliser la date valide
  userId: formData.get("assignee"),
  status: formData.get("status"), // Ajouter le statut de la tâche
 };

 try {
  // Envoi des données au back-end pour créer la tâche
  const response = await fetch("http://localhost:5000/api/task", {
   method: "POST",
   headers: {
    "Content-Type": "application/json",
   },
   body: JSON.stringify(taskData),
  });

  if (response.ok) {
   const task = await response.json();
   console.log("Tâche ajoutée : ", task);
   updateTaskList(); // Mettre à jour la liste après ajout
   taskModal.style.display = "none"; // Fermer le modal après ajout
   taskForm.reset(); // Réinitialiser le formulaire après ajout
  } else {
   const errorData = await response.json();
   console.error("Erreur lors de l'ajout de la tâche : ", errorData.error);
  }
 } catch (error) {
  console.error("Erreur lors de la communication avec le serveur : ", error);
 }
});

// Appel initial pour charger les tâches
updateTaskList();
