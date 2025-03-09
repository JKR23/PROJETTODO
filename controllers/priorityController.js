import priorityModel from "../models/priority.js";

// Créer une nouvelle priorité
export const createPriority = async (req, res) => {
 try {
  const { name } = req.body;
  const priority = await priorityModel.createPriority(name);
  res.status(201).json(priority);
 } catch (error) {
  console.error("Error creating priority:", error);
  res.status(500).json({ error: "Erreur lors de la création de la priorité" });
 }
};

// Récupérer toutes les priorités
export const getAllPriorities = async (req, res) => {
 try {
  const priorities = await priorityModel.getAllPriorities();
  res.status(200).json(priorities);
 } catch (error) {
  console.error("Error fetching priorities:", error);
  res
   .status(500)
   .json({ error: "Erreur lors de la récupération des priorités" });
 }
};

// Récupérer une priorité par ID
export const getPriorityById = async (req, res) => {
 try {
  const { id } = req.params;
  const priority = await priorityModel.getPriorityById(parseInt(id));
  if (!priority) {
   return res.status(404).json({ error: "Priorité non trouvée" });
  }
  res.status(200).json(priority);
 } catch (error) {
  console.error("Error fetching priority:", error);
  res
   .status(500)
   .json({ error: "Erreur lors de la récupération de la priorité" });
 }
};

// Mettre à jour une priorité
export const updatePriority = async (req, res) => {
 try {
  const { id } = req.params;
  const { name } = req.body;
  const updatedPriority = await priorityModel.updatePriority(
   parseInt(id),
   name
  );
  res.status(200).json(updatedPriority);
 } catch (error) {
  console.error("Error updating priority:", error);
  res
   .status(500)
   .json({ error: "Erreur lors de la mise à jour de la priorité" });
 }
};

// Supprimer une priorité
export const deletePriority = async (req, res) => {
 try {
  const { id } = req.params;
  await priorityModel.deletePriority(parseInt(id));
  res.status(200).json({ message: "Priorité supprimée avec succès" });
 } catch (error) {
  console.error("Error deleting priority:", error);
  res
   .status(500)
   .json({ error: "Erreur lors de la suppression de la priorité" });
 }
};
