// taskController.js
import taskModel from "../models/task.js";
import * as historyModel from "../models/history.js";

export const createTask = async (req, res) => {
 try {
  const { title, description, priorityId, deadline, statusId, userId } =
   req.body;

  console.log("Received task data for creation:", {
   title,
   description,
   priorityId,
   deadline,
   statusId,
   userId,
  });

  const validPriorityId = parseInt(priorityId, 10);
  const validStatusId = parseInt(statusId, 10);

  console.log(
   `Validating priority ID: ${validPriorityId}, status ID: ${validStatusId}`
  );

  if (isNaN(validPriorityId) || isNaN(validStatusId)) {
   console.error(
    `Invalid priority ID or status ID. Received: priority=${priorityId}, status=${statusId}`
   );
   return res.status(400).json({ error: "Invalid priority or status ID" });
  }

  console.log("Calling taskModel.createTask with the following parameters:", {
   title,
   description,
   validPriorityId,
   validStatusId,
   deadline,
   userId,
  });

  const task = await taskModel.createTask(
   title,
   description,
   validPriorityId,
   validStatusId,
   deadline,
   userId
  );

  console.log("Task created successfully:", task);
  res.status(201).json(task);
 } catch (error) {
  console.error("Error creating task:", error);
  res.status(500).json({
   error: error.message || "Erreur lors de la création de la tâche",
  });
 }
};

export const getTasks = async (req, res) => {
 try {
  console.log("Fetching all tasks...");

  // Appel de la méthode qui récupère toutes les tâches, sans besoin de userId
  const tasks = await taskModel.getAllTasks(); // On appelle la méthode getAllTasks sans userId
  console.log("Tasks retrieved:", tasks);

  // Répondre avec les tâches récupérées
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

  id = parseInt(id, 10);

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
  const { title, description, priorityId, statusId, userId, deadline } =
   req.body;

  id = parseInt(id);

  if (isNaN(id)) {
   return res
    .status(400)
    .json({ error: "L'ID de la tâche doit être un entier valide." });
  }

  if (isNaN(userId)) {
   return res
    .status(400)
    .json({ error: "L'ID de l'utilisateur doit être un entier valide." });
  }

  console.log(`Updating task ID: ${id} for user ID: ${userId}`);

  const statusExists = await taskModel.checkStatusExists(statusId);
  const priorityExists = await taskModel.checkPriorityExists(priorityId);

  if (!statusExists) {
   return res.status(400).json({ error: "Le statusId fourni n'existe pas." });
  }

  if (!priorityExists) {
   return res.status(400).json({ error: "Le priorityId fourni n'existe pas." });
  }

  const updatedData = {
   title,
   description,
   priorityId,
   statusId,
   userId,
   deadline: new Date(deadline),
  };

  console.log("Updating task with the following data:", updatedData);

  const updatedTask = await taskModel.updateTask(id, updatedData);

  console.log("Task updated successfully:", updatedTask);

  await historyModel.createHistory(updatedTask.id, userId, "UPDATE");

  res.status(200).json(updatedTask);
 } catch (error) {
  console.error("Error updating task:", error);
  res.status(500).json({ error: "Erreur lors de la mise à jour de la tâche" });
 }
};

export const deleteTask = async (req, res) => {
 try {
  let { id } = req.params;

  id = parseInt(id, 10);

  console.log(`Attempting to delete task with ID: ${id}`);

  const task = await taskModel.getTaskById(id);

  if (!task) {
   console.log(`Task with ID ${id} not found.`);
   return res.status(404).json({ error: "Tâche non trouvée" });
  }

  console.log(`Creating history for task ID: ${task.id} deletion.`);

  await historyModel.createHistory(task.id, task.userId, "DELETE");

  console.log(`Deleting task with ID: ${task.id}`);

  await taskModel.deleteTask(id);

  console.log(`Task with ID ${id} deleted successfully.`);

  res.status(200).json({ message: "Tâche supprimée avec succès" });
 } catch (error) {
  console.error("Error deleting task:", error);
  res.status(500).json({ error: "Erreur lors de la suppression de la tâche" });
 }
};

//controller
export const getTasksByStatusName = async (req, res) => {
 try {
  // Ajout de logs pour le débogage
  console.log("====== DÉBOGAGE DE LA ROUTE getTasksByStatusName ======");
  console.log("Route appelée avec req.params:", req.params);
  console.log("URL complète:", req.originalUrl);
  
  // Récupération du statut à partir des paramètres de la requête
  const { status } = req.params;
  console.log("Fetching tasks with status:", status);

  // Vérification de la validité du statut
  const validStatuses = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"];
  if (!validStatuses.includes(status)) {
   console.log(`Statut invalide reçu : ${status}`);
   return res.status(400).json({ error: "Statut invalide." });
  }

  console.log(`Statut ${status} valide.`);

  // Récupération des tâches depuis le modèle en filtrant uniquement par statut
  const tasks = await taskModel.getTasksByStatusName(status);

  if (tasks.length === 0) {
   console.log(`Aucune tâche trouvée pour le statut: ${status}`);
   return res
    .status(404)
    .json({ message: "Aucune tâche trouvée pour ce statut." });
  }

  // Log des tâches récupérées
  console.log(`Tâches avec le statut ${status} récupérées:`, tasks);

  // Répondre avec les tâches récupérées
  res.status(200).json(tasks);
 } catch (error) {
  // Log d'erreur
  console.error("Erreur lors de la récupération des tâches par statut:", error);
  res
   .status(500)
   .json({ error: "Erreur lors de la récupération des tâches par statut" });
 }
};

export const getTasksByIdStatus = async (req, res) => {
 try {
  const { statusId } = req.params;

  console.log(`Fetching tasks for status ID: ${statusId}`);

  if (isNaN(statusId)) {
   return res
    .status(400)
    .json({ error: "Le statusId doit être un entier valide." });
  }

  const tasks = await taskModel.getTasksByIdStatus(parseInt(statusId));

  if (tasks.length === 0) {
   console.log(`Aucune tâche trouvée pour le statut ID: ${statusId}`);
   return res
    .status(404)
    .json({ message: "Aucune tâche trouvée pour ce statut." });
  }

  console.log(`Tâches trouvées avec le statut ID ${statusId}:`, tasks);
  res.status(200).json(tasks);
 } catch (error) {
  console.error(
   "Erreur lors de la récupération des tâches par statut ID:",
   error
  );
  res
   .status(500)
   .json({ error: "Erreur lors de la récupération des tâches par statut" });
 }
};
