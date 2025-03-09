// main.js
const addButton = document.getElementById("add-button");
const taskModal = document.getElementById("task-modal");
const closeBtn = document.querySelector(".close-btn");
const taskForm = document.getElementById("task-form");
const todoList = document.getElementById("todo-list");
const inProgressList = document.getElementById("in-progress-list");
const inReviewList = document.getElementById("in-review-list");
const doneList = document.getElementById("done-list");

addButton.addEventListener("click", () => {
 console.log("Bouton Ajouter cliqué");
 taskModal.style.display = "block";
});

closeBtn.addEventListener("click", () => {
 console.log("fermeture form d'ajout tache");
 taskModal.style.display = "none";
 taskForm.reset();
});

// Fonction pour formater la date
const formatDateToISO = (dateString) => {
 const date = new Date(dateString);
 if (isNaN(date.getTime())) {
  console.error("Date invalide :", dateString);
  return null;
 }

 const year = date.getFullYear();
 const month = (date.getMonth() + 1).toString().padStart(2, "0");
 const day = date.getDate().toString().padStart(2, "0");
 return `${year}-${month}-${day}`;
};

// Création de l'élément de tâche
const createTaskElement = (task) => {
 const li = document.createElement("li");
 const description = document.createElement("span");
 description.classList.add("description");
 description.textContent = task.title;
 li.appendChild(description);

 li.addEventListener("click", async () => {
  let newStatus = "";
  if (task.status.name === "DONE") {
   newStatus = "TODO";
  } else if (task.status.name === "TODO") {
   newStatus = "IN PROGRESS";
  } else if (task.status.name === "IN PROGRESS") {
   newStatus = "IN REVIEW";
  } else if (task.status.name === "IN REVIEW") {
   newStatus = "DONE";
  }

  await updateTaskStatus(task.id, newStatus);
 });

 return li;
};

// Mettre à jour le statut de la tâche
const updateTaskStatus = async (taskId, newStatus) => {
 try {
  await fetch(`http://localhost:5000/api/task/${taskId}`, {
   method: "PUT",
   headers: {
    "Content-Type": "application/json",
   },
   body: JSON.stringify({ status: newStatus }),
  });

  updateTaskList();
 } catch (error) {
  console.error("Erreur de mise à jour de statut", error);
 }
};

// Fonction pour récupérer et afficher les tâches dans les bonnes colonnes
const updateTaskList = async () => {
 try {
  // Récupérer les tâches pour chaque statut
  const statuses = ["TODO", "IN PROGRESS", "IN REVIEW", "DONE"];

  // Vider les colonnes avant de les remplir avec les nouvelles tâches
  todoList.innerHTML = "";
  inProgressList.innerHTML = "";
  inReviewList.innerHTML = "";
  doneList.innerHTML = "";

  for (const status of statuses) {
   const response = await fetch(
    `http://localhost:5000/api/task/status/${status}`
   );
   if (response.ok) {
    const tasks = await response.json();
    tasks.forEach((task) => {
     const taskElement = createTaskElement(task);
     // Ajouter l'élément de tâche à la bonne colonne selon le statut
     switch (task.status.name) {
      case "TODO":
       todoList.appendChild(taskElement);
       break;
      case "IN PROGRESS":
       inProgressList.appendChild(taskElement);
       break;
      case "IN REVIEW":
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
  }
 } catch (error) {
  console.error("Erreur lors de la communication avec le serveur : ", error);
 }
};

// Formulaire d'ajout de tâche
taskForm.addEventListener("submit", async (e) => {
 e.preventDefault();

 const formData = new FormData(taskForm);
 const dueDate = formatDateToISO(formData.get("due-date"));

 if (!dueDate) {
  console.error("Date invalide ou manquante");
  return;
 }

 const taskData = {
  title: formData.get("title"),
  description: formData.get("description"),
  priority: formData.get("priority"),
  deadline: dueDate,
  userId: formData.get("assignee"),
  status: formData.get("status"),
 };

 try {
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
   updateTaskList();
   taskModal.style.display = "none";
   taskForm.reset();
  } else {
   const errorData = await response.json();
   console.error("Erreur lors de l'ajout de la tâche : ", errorData.error);
  }
 } catch (error) {
  console.error("Erreur lors de la communication avec le serveur : ", error);
 }
});

// Initialiser la liste des tâches lors du chargement de la page
updateTaskList();
