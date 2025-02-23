import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Créer un historique pour une tâche
export const createHistory = async (
 taskId,
 modifiedBy,
 action,
 oldStatus,
 newStatus
) => {
 try {
  console.log("Creating history for task ID:", taskId);
  const history = await prisma.history.create({
   data: {
    taskId,
    modifiedBy,
    action,
    oldStatus,
    newStatus,
   },
  });
  console.log("History created successfully:", history);
  return history;
 } catch (error) {
  console.error("Error creating history for task ID:", taskId, error);
  throw new Error("Error creating history");
 }
};

// Récupérer l'historique d'une tâche
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
