import { validateTitle, validateDate } from "./validation.js";

// Récupération des éléments du DOM
const addButton = document.getElementById("add-button");
const taskModal = document.getElementById("task-modal");
const closeBtn = document.querySelector(".close-btn");
const taskForm = document.getElementById("task-form");
const todoList = document.getElementById("todo-list");
const inProgressList = document.getElementById("in-progress-list");
const inReviewList = document.getElementById("in-review-list");
const doneList = document.getElementById("done-list");

// Ouvre le modal d'ajout de tâche
addButton.addEventListener("click", () => {
 taskModal.style.display = "block";
});

// Ferme le modal d'ajout de tâche
closeBtn.addEventListener("click", () => {
 taskModal.style.display = "none";
 taskForm.reset();
});

// Crée un élément de tâche dans la liste
const createTaskElement = (task) => {
 const li = document.createElement("li");
 const description = document.createElement("span");
 description.classList.add("description");
 description.textContent = task.title;
 li.appendChild(description);

 // Ajoute un événement de clic pour modifier la tâche
 li.addEventListener("click", () => {
  fillEditForm(task);
  document.getElementById("edit-task-modal").style.display = "block";
 });

 return li;
};

// Remplir le formulaire de modification avec les données de la tâche
const fillEditForm = (task) => {
 document.getElementById("edit-title").value = task.title;
 document.getElementById("edit-description").value = task.description;
 document.getElementById("edit-priority").value = task.priorityId;
 document.getElementById("edit-assignee").value = task.userId;
 document.getElementById("edit-status").value = task.statusId;

 // Formater la due date au format attendu (YYYY-MM-DD)
 const formattedDueDate = new Date(task.deadline).toISOString().split("T")[0];
 document.getElementById("edit-due-date").value = formattedDueDate;

 document.getElementById("edit-task-modal").dataset.taskId = task.id;
};

// Mise à jour du statut de la tâche
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

// Récupérer et afficher les tâches
const updateTaskList = async () => {
 try {
  const statuses = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"];
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
     }
    });
   } else {
    console.error("Erreur lors de la récupération des tâches");
   }
  }
 } catch (error) {
  console.error("Erreur lors de la communication avec le serveur", error);
 }
};

// Ajouter une nouvelle tâche
taskForm.addEventListener("submit", async (e) => {
 e.preventDefault();

 const formData = new FormData(taskForm);
 const title = formData.get("title");
 const dueDate = formData.get("due-date");

 const isTitleValid = validateTitle(title);
 const isDateValid = validateDate(dueDate);

 if (!isTitleValid || !isDateValid) {
  return;
 }

 const taskData = {
  title,
  description: formData.get("description"),
  priorityId: parseInt(formData.get("priority")),
  statusId: parseInt(formData.get("status")),
  userId: parseInt(formData.get("assignee")),
  deadline: dueDate,
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
   updateTaskList();
   taskModal.style.display = "none";
   taskForm.reset();
  }
 } catch (error) {
  console.error("Erreur lors de l'ajout de la tâche", error);
 }
});

// Modifier une tâche
const updateTaskButton = document.getElementById("update-task");
updateTaskButton.addEventListener("click", async () => {
 const taskId = document.getElementById("edit-task-modal").dataset.taskId;
 const title = document.getElementById("edit-title").value;
 const description = document.getElementById("edit-description").value;
 const priorityId = parseInt(document.getElementById("edit-priority").value);
 const deadline = document.getElementById("edit-due-date").value;
 const userId = parseInt(document.getElementById("edit-assignee").value);
 const statusId = parseInt(document.getElementById("edit-status").value);

 const updatedTask = {
  title,
  description,
  priorityId,
  statusId,
  userId,
  deadline,
 };

 // Vérifier que l'ID et les données sont bien présentes
 if (!taskId) {
  console.error("Aucune tâche à mettre à jour. L'ID est manquant.");
  return;
 }

 try {
  const response = await fetch(`http://localhost:5000/api/task/${taskId}`, {
   method: "PUT",
   headers: {
    "Content-Type": "application/json",
   },
   body: JSON.stringify(updatedTask),
  });

  if (response.ok) {
   console.log("Tâche mise à jour avec succès");
   updateTaskList(); // Récupérer et afficher à nouveau les tâches
   document.getElementById("edit-task-modal").style.display = "none"; // Fermer le modal
  } else {
   const errorMessage = await response.text();
   console.error("Erreur lors de la mise à jour de la tâche:", errorMessage);
  }
 } catch (error) {
  console.error("Erreur lors de la communication avec le serveur : ", error);
 }
});

// Supprimer une tâche
const deleteTaskButton = document.getElementById("delete-task");
deleteTaskButton.addEventListener("click", async () => {
 const taskId = document.getElementById("edit-task-modal").dataset.taskId;

 try {
  const response = await fetch(`http://localhost:5000/api/task/${taskId}`, {
   method: "DELETE",
  });

  if (response.ok) {
   console.log("Tâche supprimée");
   updateTaskList();
   document.getElementById("edit-task-modal").style.display = "none";
  } else {
   console.error("Erreur lors de la suppression de la tâche");
  }
 } catch (error) {
  console.error("Erreur de communication avec le serveur : ", error);
 }
});

// Fermer le modal d'ajout de tâche en cliquant à l'extérieur
window.addEventListener("click", (event) => {
 if (event.target === taskModal) {
  taskModal.style.display = "none";
  taskForm.reset();
 }

 const editTaskModal = document.getElementById("edit-task-modal");

 // Si le clic se fait en dehors du modal de modification, on le ferme
 if (event.target === editTaskModal) {
  editTaskModal.style.display = "none";
 }
});

// Initialiser la liste des tâches
updateTaskList();
