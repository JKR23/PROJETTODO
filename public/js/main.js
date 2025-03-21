document.addEventListener("DOMContentLoaded", function () {
 // Éléments du DOM
 const addTaskModal = document.getElementById("add-task-modal");
 const editTaskModal = document.getElementById("edit-task-modal");
 const historyModal = document.getElementById("history-modal");
 const addTaskForm = document.getElementById("add-task-form");
 const editTaskForm = document.getElementById("edit-task-form");
 const addButton = document.getElementById("add-button");
 const closeAddModalBtn = document.getElementById("close-add-modal");
 const closeEditModalBtn = document.getElementById("close-edit-modal");
 const closeHistoryModalBtn = document.getElementById("close-history-modal");
 const todoList = document.getElementById("todo-list");
 const inProgressList = document.getElementById("in-progress-list");
 const inReviewList = document.getElementById("in-review-list");
 const doneList = document.getElementById("done-list");
 const deleteTaskBtn = document.getElementById("delete-task");
 const historyList = document.getElementById("history-list");

 // Éléments de filtrage
 const filterPriority = document.getElementById("filter-priority");
 const sortBy = document.getElementById("sort-by");
 const applyFiltersBtn = document.getElementById("apply-filters");
 const resetFiltersBtn = document.getElementById("reset-filters");

 // Variables globales
 let currentTaskId = null;
 let allTasks = {
  TODO: [],
  IN_PROGRESS: [],
  IN_REVIEW: [],
  DONE: []
 };

 // État des filtres
 let filterState = {
  priority: "all",
  sortBy: "none"
 };

 // Initialisation
 updateTaskLists();

 // Événements
 addButton.addEventListener("click", () => {
  addTaskModal.style.display = "block";
 });

 closeAddModalBtn.addEventListener("click", () => {
  addTaskModal.style.display = "none";
  addTaskForm.reset();
 });

 closeEditModalBtn.addEventListener("click", () => {
  editTaskModal.style.display = "none";
  editTaskForm.reset();
 });

 closeHistoryModalBtn.addEventListener("click", () => {
  historyModal.style.display = "none";
  historyList.innerHTML = "";
 });

 // Fermer les modals en cliquant en dehors
 window.addEventListener("click", (event) => {
  if (event.target === addTaskModal) {
   addTaskModal.style.display = "none";
   addTaskForm.reset();
  }
  if (event.target === editTaskModal) {
   editTaskModal.style.display = "none";
   editTaskForm.reset();
  }
  if (event.target === historyModal) {
   historyModal.style.display = "none";
   historyList.innerHTML = "";
  }
 });

 // Soumission du formulaire d'ajout
 addTaskForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Récupérer les valeurs du formulaire
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const priorityId = document.getElementById("priority").value;
  const statusId = document.getElementById("status").value;
  const userId = document.getElementById("assignee").value;
  const dueDate = document.getElementById("due-date").value;

  try {
   // Créer la tâche
   const response = await fetch("http://localhost:5000/api/task", {
    method: "POST",
    headers: {
     "Content-Type": "application/json",
    },
    body: JSON.stringify({
     title,
     description,
     priorityId: parseInt(priorityId),
     statusId: parseInt(statusId),
     userId: parseInt(userId),
     deadline: dueDate,
    }),
   });

   if (!response.ok) {
    throw new Error("Erreur lors de la création de la tâche");
   }

   const task = await response.json();
   
   // Créer une entrée d'historique pour la création de la tâche
   const detailsText = `Nouvelle tâche créée: "${title}" | Priorité: ${
     {1: "Basse", 2: "Moyenne", 3: "Haute"}[parseInt(priorityId)]
   } | Statut: ${
     {1: "À faire", 2: "En cours", 3: "En révision", 4: "Terminé"}[parseInt(statusId)]
   } | Date d'échéance: ${dueDate}`;
   
   await createHistoryEntry(task.id, 1, "CREATE", detailsText);

   // Mettre à jour les listes de tâches
   updateTaskLists();

   // Réinitialiser le formulaire et fermer le modal
   addTaskForm.reset();
   addTaskModal.style.display = "none";
  } catch (error) {
   console.error("Erreur:", error);
   alert("Erreur lors de la création de la tâche: " + error.message);
  }
 });

 // Soumission du formulaire d'édition
 editTaskForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Récupérer les valeurs du formulaire
  const title = document.getElementById("edit-title").value;
  const description = document.getElementById("edit-description").value;
  const priorityId = document.getElementById("edit-priority").value;
  const statusId = document.getElementById("edit-status").value;
  const userId = document.getElementById("edit-assignee").value;
  const dueDate = document.getElementById("edit-due-date").value;

  try {
   // Récupérer les données originales de la tâche pour comparer
   const originalTaskResponse = await fetch(`http://localhost:5000/api/task/${currentTaskId}`);
   if (!originalTaskResponse.ok) {
    throw new Error("Erreur lors de la récupération des données originales de la tâche");
   }
   const originalTask = await originalTaskResponse.json();
   
   // Préparer les détails des modifications
   let changesDetails = [];
   
   if (originalTask.title !== title) {
    changesDetails.push(`Titre: "${originalTask.title}" → "${title}"`);
   }
   
   if (originalTask.description !== description) {
    // Comparer les descriptions et montrer un extrait si elles sont différentes
    if (originalTask.description && description) {
     if (originalTask.description.length > 20 || description.length > 20) {
      changesDetails.push(`Description modifiée`);
     } else {
      changesDetails.push(`Description: "${originalTask.description}" → "${description}"`);
     }
    } else if (!originalTask.description && description) {
     changesDetails.push(`Description ajoutée: "${description.substring(0, 20)}${description.length > 20 ? '...' : ''}"`);
    } else if (originalTask.description && !description) {
     changesDetails.push(`Description supprimée`);
    }
   }
   
   if (originalTask.priorityId !== parseInt(priorityId)) {
    const priorities = {1: "Basse", 2: "Moyenne", 3: "Haute"};
    changesDetails.push(`Priorité: "${priorities[originalTask.priorityId]}" → "${priorities[parseInt(priorityId)]}"`);
   }
   
   if (originalTask.statusId !== parseInt(statusId)) {
    const statuses = {1: "À faire", 2: "En cours", 3: "En révision", 4: "Terminé"};
    changesDetails.push(`Statut: "${statuses[originalTask.statusId]}" → "${statuses[parseInt(statusId)]}"`);
   }
   
   if (originalTask.userId !== parseInt(userId)) {
    const originalUser = await fetch(`http://localhost:5000/api/user/${originalTask.userId}`);
    const newUser = await fetch(`http://localhost:5000/api/user/${userId}`);
    
    if (originalUser.ok && newUser.ok) {
     const originalUserData = await originalUser.json();
     const newUserData = await newUser.json();
     changesDetails.push(`Assigné à: "${originalUserData.name}" → "${newUserData.name}"`);
    }
   }
   
   // Formater la date pour comparaison
   const originalDate = originalTask.deadline ? new Date(originalTask.deadline).toISOString().split('T')[0] : '';
   if (originalDate !== dueDate) {
    changesDetails.push(`Date d'échéance: "${originalDate}" → "${dueDate}"`);
   }
   
   // Vérifier s'il y a des changements avant de mettre à jour
   if (changesDetails.length === 0) {
    alert("Aucune modification n'a été détectée.");
    return;
   }
   
   // Mettre à jour la tâche
   const response = await fetch(
    `http://localhost:5000/api/task/${currentTaskId}`,
    {
     method: "PUT",
     headers: {
      "Content-Type": "application/json",
     },
     body: JSON.stringify({
      title,
      description,
      priorityId: parseInt(priorityId),
      statusId: parseInt(statusId),
      userId: parseInt(userId),
      deadline: dueDate,
     }),
    }
   );

   if (!response.ok) {
    throw new Error("Erreur lors de la mise à jour de la tâche");
   }

   // Créer une entrée d'historique pour la modification de la tâche avec les détails
   const detailsText = changesDetails.join(" | ");
   
   // Créer l'entrée d'historique seulement s'il y a des changements
   await createHistoryEntry(currentTaskId, 1, "UPDATE", detailsText);

   // Mettre à jour les listes de tâches
   updateTaskLists();

   // Réinitialiser le formulaire et fermer le modal
   editTaskForm.reset();
   editTaskModal.style.display = "none";
  } catch (error) {
   console.error("Erreur:", error);
   alert("Erreur lors de la mise à jour de la tâche: " + error.message);
  }
 });

 // Événement de suppression
 deleteTaskBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  
  if (confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) {
   try {
    // Récupérer les informations de la tâche avant suppression
    const taskResponse = await fetch(`http://localhost:5000/api/task/${currentTaskId}`);
    if (!taskResponse.ok) {
     throw new Error("Erreur lors de la récupération des informations de la tâche");
    }
    const taskToDelete = await taskResponse.json();
    
    // Supprimer la tâche
    const response = await fetch(`http://localhost:5000/api/task/${currentTaskId}`, {
     method: "DELETE",
    });
    
    if (response.ok) {
     // Créer une entrée d'historique pour la suppression de la tâche
     const detailsText = `Tâche supprimée: "${taskToDelete.title}" | Priorité: ${
       {1: "Basse", 2: "Moyenne", 3: "Haute"}[taskToDelete.priorityId]
     } | Statut: ${
       {1: "À faire", 2: "En cours", 3: "En révision", 4: "Terminé"}[taskToDelete.statusId]
     }`;
     
     await createHistoryEntry(taskToDelete.id, 1, "DELETE", detailsText);

     // Fermeture du modal et réinitialisation du formulaire
     editTaskModal.style.display = "none";
     editTaskForm.reset();
     
     // Mise à jour des listes de tâches
     updateTaskLists();
    } else {
     const errorData = await response.json();
     console.error("Erreur lors de la suppression de la tâche:", errorData.error);
     alert("Erreur lors de la suppression de la tâche: " + errorData.error);
    }
   } catch (error) {
    console.error("Erreur lors de l'envoi de la requête:", error);
    alert("Erreur lors de l'envoi de la requête: " + error.message);
   }
  }
 });

 // Événements pour les filtres
 applyFiltersBtn.addEventListener("click", () => {
  // Mettre à jour l'état des filtres
  filterState.priority = filterPriority.value;
  filterState.sortBy = sortBy.value;
  
  // Mettre à jour les listes de tâches avec les nouveaux filtres
  updateTaskLists();
 });
 
 resetFiltersBtn.addEventListener("click", () => {
  // Réinitialiser les sélecteurs
  filterPriority.value = "all";
  sortBy.value = "none";
  
  // Réinitialiser l'état des filtres
  filterState.priority = "all";
  filterState.sortBy = "none";
  
  // Mettre à jour les listes de tâches
  updateTaskLists();
 });

 // Fonction pour mettre à jour les listes de tâches
 function updateTaskLists() {
  // Récupérer les tâches pour chaque statut
  updateTaskList("TODO", todoList);
  updateTaskList("IN_PROGRESS", inProgressList);
  updateTaskList("IN_REVIEW", inReviewList);
  updateTaskList("DONE", doneList);
 }

 // Fonction pour récupérer et afficher les tâches d'un statut spécifique
 async function updateTaskList(status, listElement) {
  try {
   console.log(`Fetching tasks with status: ${status}`);
   const response = await fetch(`http://localhost:5000/api/task/status/${status}`);
   
   if (!response.ok) {
    throw new Error(`Erreur lors de la récupération des tâches avec le statut ${status}`);
   }
   
   const tasks = await response.json();
   console.log(`Tâches trouvées avec le statut ${status}:`, tasks);
   
   // Stocker toutes les tâches pour le filtrage
   allTasks[status] = tasks;
   
   // Appliquer les filtres aux tâches
   const filteredTasks = applyFilters(tasks);
   
   // Vider la liste
   listElement.innerHTML = "";
   
   // Afficher les tâches filtrées
   if (filteredTasks.length === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.className = "empty-list";
    emptyMessage.textContent = "Aucune tâche";
    listElement.appendChild(emptyMessage);
   } else {
    filteredTasks.forEach(task => {
     const taskElement = createTaskElement(task);
     listElement.appendChild(taskElement);
    });
   }
   
   console.log(`Tâches avec le statut ${status} récupérées:`, filteredTasks);
  } catch (error) {
   console.error(`Erreur lors de la récupération des tâches avec le statut ${status}:`, error);
   listElement.innerHTML = `<li class="error">Erreur: ${error.message}</li>`;
  }
 }

 // Fonction pour appliquer les filtres et le tri aux tâches
 function applyFilters(tasks) {
  let filteredTasks = [...tasks];
  
  // Filtrer par priorité
  if (filterState.priority !== "all") {
   filteredTasks = filteredTasks.filter(task => 
    task.priorityId === parseInt(filterState.priority)
   );
  }
  
  // Trier les tâches
  if (filterState.sortBy !== "none") {
   filteredTasks.sort((a, b) => {
    switch (filterState.sortBy) {
     case "created-asc":
      return new Date(a.createdAt) - new Date(b.createdAt);
     case "created-desc":
      return new Date(b.createdAt) - new Date(a.createdAt);
     case "deadline-asc":
      // Si pas de date limite, mettre à la fin
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return new Date(a.deadline) - new Date(b.deadline);
     case "deadline-desc":
      // Si pas de date limite, mettre à la fin
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return new Date(b.deadline) - new Date(a.deadline);
     default:
      return 0;
    }
   });
  }
  
  return filteredTasks;
 }

 // Fonction pour créer un élément de tâche
 function createTaskElement(task) {
  const li = document.createElement("li");
  
  // Déterminer la classe de priorité
  let priorityClass = "";
  let priorityText = "";
  
  switch (task.priorityId) {
   case 1:
    priorityClass = "priority-low";
    priorityText = "Basse";
    break;
   case 2:
    priorityClass = "priority-medium";
    priorityText = "Moyenne";
    break;
   case 3:
    priorityClass = "priority-high";
    priorityText = "Haute";
    break;
   default:
    priorityClass = "priority-low";
    priorityText = "Basse";
  }
  
  // Formater la date d'échéance
  const deadline = new Date(task.deadline);
  const formattedDate = deadline.toLocaleDateString('fr-FR');
  
  // Créer le contenu HTML de l'élément
  li.innerHTML = `
  <div class="task-item" data-task-id="${task.id}">
    <div class="task-header">
      <h3 class="task-title">${task.title}</h3>
      <span class="task-priority ${priorityClass}">${priorityText}</span>
    </div>
    <p class="task-description">${task.description}</p>
    <div class="task-footer">
      <div class="task-deadline">
        <span>Échéance: ${formattedDate}</span>
      </div>
      <div class="task-actions">
        <button class="task-edit" title="Modifier">
          <i class="fa-solid fa-pen-to-square" style="color: #74C0FC;"></i>
        </button>
        <button class="task-history" title="Historique">
          <i class="fa-solid fa-clock-rotate-left" style="color: #f58529;"></i>
        </button>
        <button class="task-delete" title="Supprimer">
          <i class="fa-solid fa-trash" style="color: #ff0000;"></i>
        </button>
      </div>
    </div>
  </div>
`;
 
  // Ajouter les événements sur les boutons
  const taskItem = li.querySelector(".task-item");
  
  // Ouvrir le modal d'édition en cliquant sur la tâche
  taskItem.addEventListener("click", (e) => {
   // Ne pas déclencher si on clique sur les boutons d'action
   if (e.target.classList.contains("task-edit") || e.target.classList.contains("task-delete") || e.target.classList.contains("task-history")) {
    return;
   }
   
   openEditModal(task);
  });
  
  // Bouton d'édition
  const editBtn = li.querySelector(".task-edit");
  editBtn.addEventListener("click", (e) => {
   e.stopPropagation();
   openEditModal(task);
  });
  
  // Bouton d'historique
  const historyBtn = li.querySelector(".task-history");
  historyBtn.addEventListener("click", (e) => {
   e.stopPropagation();
   showTaskHistory(task.id);
  });
  
  // Bouton de suppression
  const deleteBtn = li.querySelector(".task-delete");
  deleteBtn.addEventListener("click", async (e) => {
   e.stopPropagation();
   
   if (confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) {
    try {
     // Récupérer les informations de la tâche avant suppression
     const taskResponse = await fetch(`http://localhost:5000/api/task/${task.id}`);
     if (!taskResponse.ok) {
      throw new Error("Erreur lors de la récupération des informations de la tâche");
     }
     const taskToDelete = await taskResponse.json();
     
     // Supprimer la tâche
     const response = await fetch(`http://localhost:5000/api/task/${task.id}`, {
      method: "DELETE",
     });
     
     if (response.ok) {
      // Créer une entrée d'historique pour la suppression de la tâche
      const detailsText = `Tâche supprimée: "${taskToDelete.title}" | Priorité: ${
        {1: "Basse", 2: "Moyenne", 3: "Haute"}[taskToDelete.priorityId]
      } | Statut: ${
        {1: "À faire", 2: "En cours", 3: "En révision", 4: "Terminé"}[taskToDelete.statusId]
      }`;
      
      await createHistoryEntry(task.id, 1, "DELETE", detailsText);

      // Mise à jour des listes de tâches
      updateTaskLists();
     } else {
      console.error("Erreur lors de la suppression de la tâche");
     }
    } catch (error) {
     console.error("Erreur lors de l'envoi de la requête:", error);
    }
   }
  });
  
  return li;
 }

 // Fonction pour ouvrir le modal d'édition
 function openEditModal(task) {
  // Stocker l'ID de la tâche courante
  currentTaskId = task.id;
  
  // Remplir le formulaire avec les données de la tâche
  document.getElementById("edit-title").value = task.title;
  document.getElementById("edit-description").value = task.description;
  document.getElementById("edit-priority").value = task.priorityId;
  document.getElementById("edit-status").value = task.statusId;
  document.getElementById("edit-assignee").value = task.userId || 1; 
  
  // Formater la date pour l'input date
  const deadline = new Date(task.deadline);
  const year = deadline.getFullYear();
  const month = String(deadline.getMonth() + 1).padStart(2, "0");
  const day = String(deadline.getDate()).padStart(2, "0");
  document.getElementById("edit-due-date").value = `${year}-${month}-${day}`;
  
  // S'assurer que le bouton Modifier est visible
  const editButton = document.getElementById("edit-task-button");
  if (editButton) {
   editButton.style.display = "block";
   editButton.style.visibility = "visible";
   console.log("Bouton Modifier rendu visible");
  } else {
   console.error("Bouton Modifier non trouvé dans le DOM");
  }
  
  // Afficher le modal
  editTaskModal.style.display = "block";
 }

 // Fonction pour afficher l'historique d'une tâche
 async function showTaskHistory(taskId) {
  try {
   console.log(`Affichage de l'historique pour la tâche #${taskId}`);
   
   // Vider la liste d'historique existante
   historyList.innerHTML = "";
   
   // Récupérer l'historique de la tâche
   const response = await fetch(`http://localhost:5000/api/history/task/${taskId}`);
   
   if (!response.ok) {
    throw new Error("Erreur lors de la récupération de l'historique");
   }
   
   const historyData = await response.json();
   console.log("Historique récupéré:", historyData);
   
   // Vérifier si l'historique est vide
   if (historyData.length === 0) {
    historyList.innerHTML = "<tr><td colspan='4'>Aucun historique disponible</td></tr>";
   } else {
    // Trier l'historique par date (du plus récent au plus ancien)
    historyData.sort((a, b) => new Date(b.modifiedAt) - new Date(a.modifiedAt));
    
    // Éliminer les doublons potentiels (entrées avec le même timestamp et la même action)
    const uniqueEntries = [];
    const seenEntries = new Set();
    
    historyData.forEach(entry => {
     // Créer une clé unique pour chaque entrée basée sur l'horodatage et l'action
     const entryKey = `${entry.modifiedAt}-${entry.action}-${entry.details}`;
     
     if (!seenEntries.has(entryKey)) {
      seenEntries.add(entryKey);
      uniqueEntries.push(entry);
     }
    });
    
    // Créer une ligne pour chaque entrée d'historique unique
    uniqueEntries.forEach(entry => {
     // Formater la date correctement
     const date = new Date(entry.modifiedAt);
     // Vérifier si la date est valide
     const formattedDate = !isNaN(date.getTime()) 
       ? `${date.toLocaleDateString('fr-FR')} à ${date.toLocaleTimeString('fr-FR')}`
       : "Date inconnue";
     
     // Traduire l'action
     let actionText = "";
     switch (entry.action) {
      case "CREATE":
       actionText = "Création de la tâche";
       break;
      case "UPDATE":
       actionText = "Modification de la tâche";
       break;
      case "DELETE":
       actionText = "Suppression de la tâche";
       break;
      default:
       actionText = entry.action;
     }
     
     // Créer la ligne d'historique
     const historyRow = document.createElement("tr");
     historyRow.className = "history-item";
     
     // Ajouter une classe spécifique selon le type d'action
     if (entry.action === "CREATE") historyRow.classList.add("history-create");
     if (entry.action === "UPDATE") historyRow.classList.add("history-update");
     if (entry.action === "DELETE") historyRow.classList.add("history-delete");
     
     historyRow.innerHTML = `
      <td>${formattedDate}</td>
      <td>${actionText}</td>
      <td>Utilisateur #${entry.modifiedBy}</td>
      <td>${entry.details || ""}</td>
     `;
     
     // Ajouter la ligne à la liste
     historyList.appendChild(historyRow);
    });
   }
   
   // Afficher le modal d'historique
   historyModal.style.display = "block";
  } catch (error) {
   console.error("Erreur lors de l'affichage de l'historique:", error);
   alert("Erreur lors de l'affichage de l'historique: " + error.message);
  }
 }

 // Fonction pour créer une entrée d'historique
 async function createHistoryEntry(taskId, userId, action, details = "") {
  try {
   console.log(`Création d'une entrée d'historique - Tâche: ${taskId}, Action: ${action}, Détails: ${details}`);
   
   // Vérifier que les détails ne sont pas vides pour les actions UPDATE
   if (action === "UPDATE" && (!details || details.trim() === "")) {
    console.log("Aucun détail fourni pour la modification, entrée d'historique non créée");
    return null;
   }
   
   const response = await fetch("http://localhost:5000/api/history", {
    method: "POST",
    headers: {
     "Content-Type": "application/json",
    },
    body: JSON.stringify({
     taskId: parseInt(taskId),
     modifiedBy: parseInt(userId),
     action: action,
     details: details,
    }),
   });

   if (!response.ok) {
    throw new Error("Erreur lors de la création de l'historique");
   }

   const result = await response.json();
   console.log(`Historique créé avec succès pour la tâche #${taskId}, action: ${action}`);
   return result;
  } catch (error) {
   console.error(`Erreur lors de la création de l'historique pour la tâche #${taskId}:`, error);
   throw error;
  }
 }
});
