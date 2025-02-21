// controllers/userController.js
import userModel from "../models/user.js"; // Utilisation de l'import ES6

// Inscription d'un utilisateur
export const registerUser = async (req, res) => {
 try {
  const { username, password, email, role } = req.body;
  const user = await userModel.createUser(username, password, email, role);
  res.status(201).json(user);
 } catch (error) {
  res.status(500).json({ error: "Erreur lors de l'inscription" });
 }
};

// Connexion d'un utilisateur
export const loginUser = async (req, res) => {
 try {
  const { email, password } = req.body;
  const isValid = await userModel.checkPassword(email, password);
  if (!isValid) {
   return res.status(401).json({ error: "Identifiants invalides" });
  }
  const user = await userModel.findUserByEmail(email);
  // Générer un token JWT ici (utiliser jsonwebtoken)
  const token = "JWT_TOKEN"; // Tu devras générer le vrai token
  res.status(200).json({ token });
 } catch (error) {
  res.status(500).json({ error: "Erreur lors de la connexion" });
 }
};

// Récupérer un utilisateur par son ID
export const getUserById = async (req, res) => {
 try {
  const { id } = req.params; // Récupérer l'ID de l'URL
  const user = await userModel.findUserById(id); // Utiliser la méthode findUserById du modèle

  if (!user) {
   return res.status(404).json({ error: "Utilisateur non trouvé" });
  }

  res.status(200).json(user);
 } catch (error) {
  res
   .status(500)
   .json({ error: "Erreur lors de la récupération de l'utilisateur" });
 }
};

// Récupérer un utilisateur par son email
export const getUserByEmail = async (req, res) => {
 try {
  const email = req.params.email;
  const user = await userModel.findUserByEmail(email);

  if (!user) {
   return res.status(404).json({ error: "Utilisateur non trouvé" });
  }

  res.status(200).json(user);
 } catch (error) {
  res
   .status(500)
   .json({ error: "Erreur lors de la récupération de l'utilisateur" });
 }
};

// controllers/userController.js
export const getAllUsers = async (req, res) => {
 try {
  const users = await userModel.findAllUsers(); // On essaie de récupérer tous les utilisateurs
  if (!users || users.length === 0) {
   return res.status(404).json({ error: "Aucun utilisateur trouvé" });
  }
  res.status(200).json(users); // Si tout va bien, on renvoie la liste des utilisateurs
 } catch (error) {
  console.error("Erreur lors de la récupération des utilisateurs :", error); // Affichage détaillé de l'erreur
  res.status(500).json({
   error: "Erreur lors de la récupération des utilisateurs",
   details: error.message,
  });
 }
};

// Mettre à jour un utilisateur par son ID
export const updateUser = async (req, res) => {
 try {
  const { id } = req.params; // Récupérer l'ID de l'URL
  const { username, password, email, role } = req.body; // Récupérer les nouvelles données de l'utilisateur

  // Vérifier si l'utilisateur existe
  const user = await userModel.findUserById(id);
  if (!user) {
   return res.status(404).json({ error: "Utilisateur non trouvé" });
  }

  // Mettre à jour l'utilisateur
  const updatedUser = await userModel.updateUser(id, {
   username,
   password,
   email,
   role,
  });

  res.status(200).json(updatedUser);
 } catch (error) {
  res
   .status(500)
   .json({ error: "Erreur lors de la mise à jour de l'utilisateur" });
 }
};

// Supprimer un utilisateur par son ID
export const deleteUser = async (req, res) => {
 try {
  const { id } = req.params; // Récupérer l'ID de l'URL

  // Vérifier si l'utilisateur existe
  const user = await userModel.findUserById(id);
  if (!user) {
   return res.status(404).json({ error: "Utilisateur non trouvé" });
  }

  // Supprimer l'utilisateur
  await userModel.deleteUser(id);

  res.status(200).json({ message: "Utilisateur supprimé avec succès" });
 } catch (error) {
  res
   .status(500)
   .json({ error: "Erreur lors de la suppression de l'utilisateur" });
 }
};
