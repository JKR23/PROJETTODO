import * as roleModel from "../models/role.js";

// Créer un rôle
export const createRole = async (req, res) => {
 try {
  const { name } = req.body;
  console.log("Creating new role with name:", name);
  const role = await roleModel.createRole(name);
  console.log("Role created:", role);
  res.status(201).json(role);
 } catch (error) {
  console.error("Error creating role:", error);
  res.status(500).json({ error: "Erreur lors de la création du rôle" });
 }
};

// Récupérer tous les rôles
export const getAllRoles = async (req, res) => {
 try {
  console.log("Fetching all roles");
  const roles = await roleModel.getAllRoles();
  console.log("Roles retrieved:", roles);
  res.status(200).json(roles);
 } catch (error) {
  console.error("Error fetching roles:", error);
  res.status(500).json({ error: "Erreur lors de la récupération des rôles" });
 }
};

// Récupérer un rôle par ID
export const getRoleById = async (req, res) => {
 const { id } = req.params;
 try {
  console.log("Fetching role by ID:", id);
  const role = await roleModel.getRoleById(parseInt(id));
  if (!role) {
   console.log("Role not found:", id);
   return res.status(404).json({ error: "Rôle non trouvé" });
  }
  console.log("Role found:", role);
  res.status(200).json(role);
 } catch (error) {
  console.error("Error fetching role:", error);
  res.status(500).json({ error: "Erreur lors de la récupération du rôle" });
 }
};

// Mettre à jour un rôle
export const updateRole = async (req, res) => {
 const { id } = req.params;
 const { name } = req.body;
 try {
  console.log("Updating role with ID:", id, "New name:", name);
  const updatedRole = await roleModel.updateRole(parseInt(id), name);
  console.log("Role updated:", updatedRole);
  res.status(200).json(updatedRole);
 } catch (error) {
  console.error("Error updating role:", error);
  res.status(500).json({ error: "Erreur lors de la mise à jour du rôle" });
 }
};

// Supprimer un rôle
export const deleteRole = async (req, res) => {
 const { id } = req.params;
 try {
  console.log("Deleting role with ID:", id);
  await roleModel.deleteRole(parseInt(id));
  console.log("Role deleted:", id);
  res.status(200).json({ message: `Role with ID ${id} deleted successfully.` });
 } catch (error) {
  console.error("Error deleting role:", error);
  res.status(500).json({ error: "Error deleting the role" });
 }
};
