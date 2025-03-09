import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Créer un historique pour une tâche
export const createHistory = async (taskId, modifiedBy, action) => {
 try {
  console.log("Creating history for task ID:", taskId);
  const history = await prisma.history.create({
   data: {
    taskId,
    modifiedBy,
    action,
   },
  });
  console.log("History created successfully:", history);
  return history;
 } catch (error) {
  console.error("Error creating history for task ID:", taskId, error);
  throw new Error("Error creating history");
 }
};

// Récupérer l'historique d'une tâche spécifique par son ID
export const getHistoryByTaskId = async (taskId) => {
 try {
  console.log("Fetching history for task ID:", taskId);
  const history = await prisma.history.findMany({
   where: { taskId },
  });
  console.log("History retrieved:", history);
  return history;
 } catch (error) {
  console.error("Error fetching history for task ID:", taskId, error);
  throw new Error("Error fetching history");
 }
};

// Récupérer tous les historiques
export const getAllHistories = async () => {
 try {
  console.log("Fetching all histories");
  const histories = await prisma.history.findMany(); // Récupère toutes les entrées d'historique
  console.log("All histories retrieved:", histories);
  return histories;
 } catch (error) {
  console.error("Error fetching all histories:", error);
  throw new Error("Error fetching all histories");
 }
};
