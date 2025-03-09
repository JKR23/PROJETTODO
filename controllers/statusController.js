import statusModel from "../models/status.js";

// Créer un nouveau statut
export const createStatus = async (req, res) => {
 try {
  const { name } = req.body;
  const status = await statusModel.createStatus(name);
  res.status(201).json(status);
 } catch (error) {
  console.error("Error creating status:", error);
  res.status(500).json({ error: "Erreur lors de la création du statut" });
 }
};

// Récupérer tous les statuts
export const getAllStatuses = async (req, res) => {
 try {
  const statuses = await statusModel.getAllStatuses();
  res.status(200).json(statuses);
 } catch (error) {
  console.error("Error fetching statuses:", error);
  res.status(500).json({ error: "Erreur lors de la récupération des statuts" });
 }
};

// Récupérer un statut par ID
export const getStatusById = async (req, res) => {
 try {
  const { id } = req.params;
  const status = await statusModel.getStatusById(parseInt(id));
  if (!status) {
   return res.status(404).json({ error: "Statut non trouvé" });
  }
  res.status(200).json(status);
 } catch (error) {
  console.error("Error fetching status:", error);
  res.status(500).json({ error: "Erreur lors de la récupération du statut" });
 }
};

// Mettre à jour un statut
export const updateStatus = async (req, res) => {
 try {
  const { id } = req.params;
  const { name } = req.body;
  const updatedStatus = await statusModel.updateStatus(parseInt(id), name);
  res.status(200).json(updatedStatus);
 } catch (error) {
  console.error("Error updating status:", error);
  res.status(500).json({ error: "Erreur lors de la mise à jour du statut" });
 }
};

// Supprimer un statut
export const deleteStatus = async (req, res) => {
 try {
  const { id } = req.params;
  await statusModel.deleteStatus(parseInt(id));
  res.status(200).json({ message: "Statut supprimé avec succès" });
 } catch (error) {
  console.error("Error deleting status:", error);
  res.status(500).json({ error: "Erreur lors de la suppression du statut" });
 }
};
