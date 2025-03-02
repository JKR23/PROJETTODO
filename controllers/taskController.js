//controllers/taskControllers.js
import taskModel from "../models/task.js"; // Importation du modèle task

// Controllers/taskControllers.js

// Fonction pour formater la priorité
const formatPriority = (priority) => {
 const validPriorities = ["LOW", "MEDIUM", "HIGH"];
 return validPriorities.includes(priority.toUpperCase())
  ? priority.toUpperCase()
  : "LOW"; // Défaut à "LOW" si invalide
};

// Créer une nouvelle tâche
export const createTask = async (req, res) => {
 try {
  const { title, description, priority, deadline } = req.body;
  const userId = 1; // ID de l'utilisateur (en général, cela provient de l'authentification)

  // Validation de la priorité
  const validPriority = formatPriority(priority);

  console.log("Creating task with data:", {
   title,
   description,
   priority: validPriority,
   deadline,
  });

  // Appel au modèle avec tous les paramètres, y compris status
  const task = await taskModel.createTask(
   title,
   description,
   validPriority, // Utiliser la priorité validée
   deadline,
   userId
  );

  console.log("value status : ", task.status),
   console.log("Task created:", task);
  res.status(201).json(task);
 } catch (error) {
  console.error("Error creating task:", error);
  res.status(500).json({ error: "Erreur lors de la création de la tâche" });
 }
};

// Récupérer toutes les tâches de l'utilisateur
export const getTasks = async (req, res) => {
 try {
  const userId = 1; // ID de l'utilisateur (en général, cela provient de l'authentification)
  console.log("Fetching tasks for user ID:", userId);
  const tasks = await taskModel.getAllTasksByUser(userId);
  console.log("Tasks retrieved:", tasks);
  res.status(200).json(tasks);
 } catch (error) {
  console.error("Error fetching tasks:", error);
  res.status(500).json({ error: "Erreur lors de la récupération des tâches" });
 }
};

export const getTaskById = async (req, res) => {
 try {
  let { id } = req.params;
  console.log("Fetching task by ID:", id);

  // Convert the ID to an integer
  id = parseInt(id, 10); // or use Number(id)

  if (isNaN(id)) {
   return res
    .status(400)
    .json({ error: "L'ID de la tâche doit être un entier valide." });
  }

  const task = await taskModel.getTaskById(id);
  if (!task) {
   console.log("Task not found:", id);
   return res.status(404).json({ error: "Tâche non trouvée" });
  }
  console.log("Task found:", task);
  res.status(200).json(task);
 } catch (error) {
  console.error("Error fetching task:", error);
  res.status(500).json({ error: "Erreur lors de la récupération de la tâche" });
 }
};

export const updateTask = async (req, res) => {
 try {
  let { id } = req.params;
  const { title, description, priority, deadline, status } = req.body;

  // Convertir id en entier
  id = parseInt(id);

  if (isNaN(id)) {
   return res
    .status(400)
    .json({ error: "L'ID de la tâche doit être un entier valide." });
  }

  // Vérification du statut
  const validStatuses = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"];

  // Vérification que `status` existe et est valide
  if (status && !validStatuses.includes(status)) {
   return res.status(400).json({ error: "Statut invalide." });
  }

  // Vérification si `status` est omis mais qu'on attend sa valeur
  if (!status) {
   return res.status(400).json({ error: "Le champ 'status' est requis." });
  }

  // Préparer les données à mettre à jour
  let updatedData = {
   title,
   description,
   priority,
   deadline: new Date(deadline),
   status: status, // Assurez-vous d'ajouter le status ici s'il est présent et valide
  };

  console.log("Updating task with the following data:", updatedData);

  // Appeler la fonction de mise à jour dans le modèle
  const updatedTask = await taskModel.updateTask(id, updatedData);

  console.log("Task updated:", updatedTask);
  res.status(200).json(updatedTask);
 } catch (error) {
  console.error("Error updating task:", error);
  res.status(500).json({ error: "Erreur lors de la mise à jour de la tâche" });
 }
};

// Supprimer une tâche
export const deleteTask = async (req, res) => {
 try {
  const { id } = req.params;
  console.log("Deleting task with ID:", id);
  await taskModel.deleteTask(id);
  console.log("Task deleted:", id);
  res.status(200).json({ message: "Tâche supprimée avec succès" });
 } catch (error) {
  console.error("Error deleting task:", error);
  res.status(500).json({ error: "Erreur lors de la suppression de la tâche" });
 }
};

// Récupérer les tâches par statut
export const getTasksByStatus = async (req, res) => {
 try {
  const { status } = req.params;
  console.log("Fetching tasks with status:", status);

  // Vérification si le statut est valide
  const validStatuses = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"];
  if (!validStatuses.includes(status)) {
   return res.status(400).json({ error: "Statut invalide." });
  }

  const userId = 1; // ID de l'utilisateur (en général, cela provient de l'authentification)
  const tasks = await taskModel.getTasksByStatus(userId, status);

  if (tasks.length === 0) {
   console.log(`No tasks found for status: ${status}`);
   return res
    .status(404)
    .json({ message: "Aucune tâche trouvée pour ce statut." });
  }

  console.log(`Tasks with status ${status} retrieved:`, tasks);
  res.status(200).json(tasks);
 } catch (error) {
  console.error("Error fetching tasks by status:", error);
  res
   .status(500)
   .json({ error: "Erreur lors de la récupération des tâches par statut" });
 }
};
