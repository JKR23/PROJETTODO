import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Créer un rôle
export const createRole = async (name) => {
 try {
  console.log("Creating a new role with name:", name);
  const role = await prisma.role.create({
   data: {
    name,
   },
  });
  console.log("Role created successfully:", role);
  return role;
 } catch (error) {
  console.error("Error creating role:", error);
  throw new Error("Error creating role");
 }
};

// Récupérer tous les rôles
export const getAllRoles = async () => {
 try {
  console.log("Fetching all roles");
  const roles = await prisma.role.findMany();
  console.log("Roles retrieved:", roles);
  return roles;
 } catch (error) {
  console.error("Error fetching roles:", error);
  throw new Error("Error fetching roles");
 }
};

// Récupérer un rôle par son ID
export const getRoleById = async (id) => {
 try {
  console.log("Fetching role by ID:", id);
  const role = await prisma.role.findUnique({
   where: { id },
  });
  console.log("Role found:", role);
  return role;
 } catch (error) {
  console.error("Error fetching role by ID:", id, error);
  throw new Error("Error fetching role");
 }
};

// Mettre à jour un rôle
export const updateRole = async (id, name) => {
 try {
  console.log("Updating role with ID:", id, "New name:", name);
  const updatedRole = await prisma.role.update({
   where: { id },
   data: { name },
  });
  console.log("Role updated successfully:", updatedRole);
  return updatedRole;
 } catch (error) {
  console.error("Error updating role with ID:", id, error);
  throw new Error("Error updating role");
 }
};

// Supprimer un rôle
export const deleteRole = async (id) => {
 try {
  console.log("Deleting role with ID:", id);
  await prisma.role.delete({
   where: { id },
  });
  console.log("Role deleted successfully:", id);
 } catch (error) {
  console.error("Error deleting role with ID:", id, error);
  throw new Error("Error deleting role");
 }
};
