//models/status
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Créer un nouveau statut
const createStatus = async (name) => {
 try {
  const status = await prisma.status.create({
   data: {
    name,
   },
  });
  return status;
 } catch (error) {
  console.error("Error creating status:", error);
  throw new Error("Error creating status");
 }
};

// Récupérer tous les statuts
const getAllStatuses = async () => {
 try {
  const statuses = await prisma.status.findMany();
  return statuses;
 } catch (error) {
  console.error("Error fetching statuses:", error);
  throw new Error("Error fetching statuses");
 }
};

// Récupérer un statut par son ID
const getStatusById = async (id) => {
 try {
  const status = await prisma.status.findUnique({
   where: { id },
  });
  return status;
 } catch (error) {
  console.error("Error fetching status by ID:", error);
  throw new Error("Error fetching status by ID");
 }
};

// Mettre à jour un statut
const updateStatus = async (id, name) => {
 try {
  const updatedStatus = await prisma.status.update({
   where: { id },
   data: { name },
  });
  return updatedStatus;
 } catch (error) {
  console.error("Error updating status:", error);
  throw new Error("Error updating status");
 }
};

// Supprimer un statut
const deleteStatus = async (id) => {
 try {
  await prisma.status.delete({
   where: { id },
  });
 } catch (error) {
  console.error("Error deleting status:", error);
  throw new Error("Error deleting status");
 }
};

export default {
 createStatus,
 getAllStatuses,
 getStatusById,
 updateStatus,
 deleteStatus,
};
