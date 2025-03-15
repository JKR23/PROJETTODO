//taskModel.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Fonction pour vérifier si l'utilisateur existe
const checkUserExists = async (userId) => {
 console.log("Vérification de l'existence de l'utilisateur...");
 const userExists = await prisma.user.findUnique({
  where: { id: userId },
 });
 if (!userExists) {
  throw new Error(`L'utilisateur avec l'ID ${userId} n'existe pas.`);
 }
 console.log(`Utilisateur ${userId} trouvé :`, userExists);
 return userExists;
};

const checkPriorityExists = async (priorityId) => {
 console.log("Checking if priority exists for ID:", priorityId); // Log ajoutée

 if (isNaN(priorityId)) {
  console.error("Priority ID is not a valid integer:", priorityId); // Log d'erreur
  throw new Error("Priority ID is not a valid integer");
 }

 const priority = await prisma.priority.findUnique({
  where: { id: priorityId },
 });

 console.log("Priority check result:", priority); // Log ajoutée pour afficher le résultat

 return priority !== null; // Retourne true si la priorité existe, sinon false
};

// Vérifier si l'ID du statut existe dans la base de données
const checkStatusExists = async (statusId) => {
 console.log("Checking if status exists for ID:", statusId); // Log ajoutée

 const status = await prisma.status.findUnique({
  where: { id: statusId },
 });

 console.log("Status check result:", status); // Log ajoutée pour afficher le résultat

 return status !== null; // Retourne true si le statut existe, sinon false
};

// Créer une nouvelle tâche
const createTask = async (
 title,
 description,
 priorityId,
 statusId,
 deadline,
 userId
) => {
 try {
  console.log("Creating task with the following data:", {
   title,
   description,
   priorityId,
   statusId,
   deadline,
   userId,
  }); // Log ajoutée pour afficher les données de la tâche à créer

  // Vérification de l'existence de l'utilisateur
  await checkUserExists(userId);

  // Vérifier si la priorité et le statut existent dans la base de données
  const priorityExists = await checkPriorityExists(priorityId);
  if (!priorityExists) {
   console.error("Invalid priority ID:", priorityId); // Log d'erreur en cas de priorité invalide
   throw new Error("Le priorityId fourni n'existe pas.");
  }

  const statusExists = await checkStatusExists(statusId);
  if (!statusExists) {
   console.error("Invalid status ID:", statusId); // Log d'erreur en cas de statut invalide
   throw new Error("Le statusId fourni n'existe pas.");
  }

  // Si tout est valide, procéder à la création de la tâche
  const task = await prisma.task.create({
   data: {
    title,
    description,
    priorityId,
    statusId,
    deadline: new Date(deadline),
    userId,
   },
  });

  console.log("Task created successfully:", task); // Log après création réussie
  return task;
 } catch (error) {
  console.error("Error creating task:", error); // Log d'erreur général
  throw new Error("Error creating task: " + error.message); // Renvoyer l'erreur spécifique
 }
};

// Récupérer toutes les tâches d'un utilisateur
// Récupérer toutes les tâches sans filtrage par utilisateur
const getAllTasks = async () => {
 try {
  console.log("Fetching all tasks...");

  // Récupération de toutes les tâches dans la base de données
  const tasks = await prisma.task.findMany();

  console.log("All tasks retrieved:", tasks);

  return tasks;
 } catch (error) {
  console.error("Error fetching all tasks:", error);
  throw new Error("Error fetching tasks");
 }
};

// Récupérer une tâche par ID
const getTaskById = async (id) => {
 try {
  console.log("Fetching task by ID:", id);
  const task = await prisma.task.findUnique({
   where: { id },
  });
  console.log("Task found:", task);
  return task;
 } catch (error) {
  console.error("Error fetching task by ID:", id, error);
  throw new Error("Error fetching task");
 }
};

//task.js
//update task
const updateTask = async (id, data) => {
 try {
  console.log("Starting update for task:", id);

  // Vérification si le statusId existe dans la base de données
  const statusExists = await checkStatusExists(data.statusId);
  if (!statusExists) {
   console.error("Invalid statusId:", data.statusId);
   throw new Error("Le statusId fourni n'existe pas.");
  }

  // Vérification si le priorityId existe dans la base de données
  const priorityExists = await checkPriorityExists(data.priorityId);
  if (!priorityExists) {
   console.error("Invalid priorityId:", data.priorityId);
   throw new Error("Le priorityId fourni n'existe pas.");
  }

  // Préparer les données à mettre à jour
  const updatedData = {
   title: data.title,
   description: data.description,
   priorityId: data.priorityId,
   statusId: data.statusId,
   deadline: new Date(data.deadline),
   userId: data.userId,
  };

  console.log("Updating task with the following data:", updatedData);

  // Mise à jour de la tâche
  const updatedTask = await prisma.task.update({
   where: { id },
   data: updatedData,
  });

  console.log("Task updated successfully:", updatedTask);
  return updatedTask;
 } catch (error) {
  console.error("Error updating task with ID:", id, error);
  throw new Error("Error updating task");
 }
};

const deleteTask = async (id) => {
 try {
  // Ensure the id is an integer
  id = parseInt(id, 10);

  // Log the deletion attempt
  console.log("Attempting to delete task with ID:", id);

  // Proceed with the deletion using Prisma
  await prisma.task.delete({
   where: { id },
  });

  // Log success after the task is deleted
  console.log(`Task with ID ${id} deleted successfully.`);
 } catch (error) {
  // Log detailed error message
  console.error("Error deleting task with ID:", id, error);

  // Throw an error for the controller to handle
  throw new Error("Error deleting task");
 }
};

// Récupérer les tâches par statut le name
// Récupérer les tâches par statut
// Récupérer les tâches par statut en utilisant uniquement le nom du statut
const getTasksByStatusName = async (statusName) => {
 try {
  // Log de début de la fonction avec les paramètres reçus
  console.log(
   `Début de la récupération des tâches avec le statut: ${statusName}`
  );

  // Récupération des tâches dans la base de données
  const tasks = await prisma.task.findMany({
   where: {
    status: {
     name: statusName, // On filtre les tâches selon le nom du statut dans la table 'Status'
    },
   },
   include: {
    status: true, // Inclure les informations sur le statut, si nécessaire
   },
  });

  // Log des tâches trouvées
  console.log(`Tâches trouvées avec le statut ${statusName}:`);
  console.log(tasks);

  // Retourner les tâches récupérées
  return tasks;
 } catch (error) {
  // Log en cas d'erreur
  console.error(
   `Erreur lors de la récupération des tâches pour le statut: ${statusName}`
  );
  console.error("Détails de l'erreur:", error);

  // Lancer une exception avec un message d'erreur générique
  throw new Error("Erreur lors de la récupération des tâches par statut");
 }
};

const getTasksByIdStatus = async (statusId) => {
 try {
  console.log(`Récupération des tâches pour le statut ID: ${statusId}`);

  const tasks = await prisma.task.findMany({
   where: {
    statusId, // Filtrage par l'ID du statut
   },
   include: {
    status: true, // Inclure le statut si nécessaire
   },
  });

  console.log(`Tâches trouvées avec le statut ID ${statusId}:`, tasks);
  return tasks;
 } catch (error) {
  console.error(
   "Erreur lors de la récupération des tâches par statut pour l'utilisateur ID:",
   userId,
   error
  );
  throw new Error("Erreur lors de la récupération des tâches par statut");
 }
};

export default {
 createTask,
 getAllTasks,
 getTaskById,
 updateTask,
 deleteTask,
 getTasksByStatusName,
 checkPriorityExists,
 checkStatusExists,
 getTasksByIdStatus,
 checkUserExists,
};
