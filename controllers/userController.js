import * as userModel from "../models/user.js";

// Créer un utilisateur
export const registerUser = async (req, res) => {
 try {
  console.log("Registering new user");
  const user = await userModel.createUser();
  console.log("User created:", user);
  res.status(201).json(user);
 } catch (error) {
  console.error("Error registering user:", error);
  res
   .status(500)
   .json({ error: "Erreur lors de la création de l'utilisateur" });
 }
};

// Récupérer tous les utilisateurs
export const getAllUsers = async (req, res) => {
 try {
  console.log("Fetching all users");
  const users = await userModel.getAllUsers();
  console.log("Users retrieved:", users);
  res.status(200).json(users);
 } catch (error) {
  console.error("Error fetching users:", error);
  res
   .status(500)
   .json({ error: "Erreur lors de la récupération des utilisateurs" });
 }
};

// Récupérer un utilisateur par ID
export const getUserById = async (req, res) => {
 const { id } = req.params;
 try {
  console.log("Fetching user by ID:", id);
  const user = await userModel.getUserById(parseInt(id));
  if (!user) {
   console.log("User not found:", id);
   return res.status(404).json({ error: "Utilisateur non trouvé" });
  }
  console.log("User found:", user);
  res.status(200).json(user);
 } catch (error) {
  console.error("Error fetching user:", error);
  res
   .status(500)
   .json({ error: "Erreur lors de la récupération de l'utilisateur" });
 }
};

// Mettre à jour un utilisateur
export const updateUser = async (req, res) => {
 const { id } = req.params;
 const { username } = req.body;
 try {
  console.log("Updating user with ID:", id, "New username:", username);
  const updatedUser = await userModel.updateUser(parseInt(id), username);
  console.log("User updated:", updatedUser);
  res.status(200).json(updatedUser);
 } catch (error) {
  console.error("Error updating user:", error);
  res
   .status(500)
   .json({ error: "Erreur lors de la mise à jour de l'utilisateur" });
 }
};

// Supprimer un utilisateur
export const deleteUser = async (req, res) => {
 const { id } = req.params;
 try {
  console.log("Deleting user with ID:", id);
  await userModel.deleteUser(parseInt(id));
  console.log("User deleted:", id);
  res.status(204).send();
 } catch (error) {
  console.error("Error deleting user:", error);
  res
   .status(500)
   .json({ error: "Erreur lors de la suppression de l'utilisateur" });
 }
};
