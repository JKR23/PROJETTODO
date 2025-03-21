import * as historyModel from "../models/history.js";

// Créer un historique pour une tâche
export const createHistory = async (req, res) => {
 const { taskId, modifiedBy, action, details } = req.body;
 try {
  console.log("Creating history for task ID:", taskId);
  const history = await historyModel.createHistory(taskId, modifiedBy, action, details);
  console.log("History created:", history);
  res.status(201).json(history);
 } catch (error) {
  console.error("Error creating history:", error);
  res.status(500).json({ error: "Erreur lors de la création de l'historique" });
 }
};

// Récupérer l'historique d'une tâche spécifique par son ID
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

// Récupérer l'historique de toutes les tâches
export const getHistories = async (req, res) => {
 try {
  console.log("Fetching all histories");
  const histories = await historyModel.getAllHistories();
  console.log("Histories retrieved:", histories);
  res.status(200).json(histories);
 } catch (error) {
  console.error("Error fetching histories:", error);
  res
   .status(500)
   .json({ error: "Erreur lors de la récupération des historiques" });
 }
};
