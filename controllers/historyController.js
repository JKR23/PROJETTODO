import * as historyModel from "../models/history.js";

// Créer un historique pour une tâche
export const createHistory = async (req, res) => {
 const { taskId, modifiedBy, action, oldStatus, newStatus } = req.body;
 try {
  console.log("Creating history for task ID:", taskId);
  const history = await historyModel.createHistory(
   taskId,
   modifiedBy,
   action,
   oldStatus,
   newStatus
  );
  console.log("History created:", history);
  res.status(201).json(history);
 } catch (error) {
  console.error("Error creating history:", error);
  res.status(500).json({ error: "Erreur lors de la création de l'historique" });
 }
};

// Récupérer l'historique d'une tâche
export const getHistoryByTaskId = async (req, res) => {
 const { taskId } = req.params;
 try {
  console.log("Fetching history for task ID:", taskId);
  const history = await historyModel.getHistoryByTaskId(parseInt(taskId));
  console.log("History retrieved:", history);
  res.status(200).json(history);
 } catch (error) {
  console.error("Error fetching history:", error);
  res
   .status(500)
   .json({ error: "Erreur lors de la récupération de l'historique" });
 }
};
