import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Créer une nouvelle priorité
const createPriority = async (name) => {
 try {
  const priority = await prisma.priority.create({
   data: {
    name,
   },
  });
  return priority;
 } catch (error) {
  console.error("Error creating priority:", error);
  throw new Error("Error creating priority");
 }
};

// Récupérer toutes les priorités
const getAllPriorities = async () => {
 try {
  const priorities = await prisma.priority.findMany();
  return priorities;
 } catch (error) {
  console.error("Error fetching priorities:", error);
  throw new Error("Error fetching priorities");
 }
};

// Récupérer une priorité par son ID
const getPriorityById = async (id) => {
 try {
  const priority = await prisma.priority.findUnique({
   where: { id },
  });
  return priority;
 } catch (error) {
  console.error("Error fetching priority by ID:", error);
  throw new Error("Error fetching priority by ID");
 }
};

// Mettre à jour une priorité
const updatePriority = async (id, name) => {
 try {
  const updatedPriority = await prisma.priority.update({
   where: { id },
   data: { name },
  });
  return updatedPriority;
 } catch (error) {
  console.error("Error updating priority:", error);
  throw new Error("Error updating priority");
 }
};

// Supprimer une priorité
const deletePriority = async (id) => {
 try {
  await prisma.priority.delete({
   where: { id },
  });
 } catch (error) {
  console.error("Error deleting priority:", error);
  throw new Error("Error deleting priority");
 }
};

export default {
 createPriority,
 getAllPriorities,
 getPriorityById,
 updatePriority,
 deletePriority,
};
