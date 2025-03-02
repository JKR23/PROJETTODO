//task.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Créer une nouvelle tâche
// Créer une nouvelle tâche
const createTask = async (title, description, priority, deadline, userId) => {
 try {
  console.log("Creating task with data:", {
   title,
   description,
   priority,
   deadline,
   userId,
  });

  // Vérifier et ajouter un statut par défaut si aucun n'est fourni
  const task = await prisma.task.create({
   data: {
    title,
    description,
    priority,
    deadline: new Date(deadline),
    userId,
   },
  });

  console.log("Task created successfully:", task);
  return task;
 } catch (error) {
  console.error("Error creating task:", error);
  throw new Error("Error creating task");
 }
};

// Récupérer toutes les tâches d'un utilisateur
const getAllTasksByUser = async (userId) => {
 try {
  console.log("Fetching tasks for user ID:", userId);
  const tasks = await prisma.task.findMany({
   where: { userId },
  });
  console.log("Tasks retrieved:", tasks);
  return tasks;
 } catch (error) {
  console.error("Error fetching tasks for user ID:", userId, error);
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

// Mettre à jour une tâche
const updateTask = async (id, data) => {
 try {
  console.log("staring update:", data.status);
  const validStatuses = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"];
  if (data.status && !validStatuses.includes(data.status)) {
   console.error("invalid status:", data.status);
   throw new Error("Statut invalide.");
  }

  console.log("Updating task with ID:", id, "New data:", data);
  const updatedTask = await prisma.task.update({
   where: { id },
   data,
  });
  console.log("Task updated successfully:", updatedTask);
  return updatedTask;
 } catch (error) {
  console.error("Error updating task with ID:", id, error);
  throw new Error("Error updating task");
 }
};

// Supprimer une tâche
const deleteTask = async (id) => {
 try {
  console.log("Deleting task with ID:", id);
  await prisma.task.delete({
   where: { id },
  });
  console.log("Task deleted successfully:", id);
 } catch (error) {
  console.error("Error deleting task with ID:", id, error);
  throw new Error("Error deleting task");
 }
};

// Récupérer les tâches par statut
const getTasksByStatus = async (userId, status) => {
 try {
  console.log(`Fetching tasks for user ID: ${userId} with status: ${status}`);
  const tasks = await prisma.task.findMany({
   where: {
    userId,
    status,
   },
  });
  console.log(`Tasks found with status ${status}:`, tasks);
  return tasks;
 } catch (error) {
  console.error("Error fetching tasks by status for user ID:", userId, error);
  throw new Error("Error fetching tasks by status");
 }
};

export default {
 createTask,
 getAllTasksByUser,
 getTaskById,
 updateTask,
 deleteTask,
 getTasksByStatus,
};
