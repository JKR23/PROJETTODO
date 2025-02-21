// models/user.js
import { prisma } from "../prismaClient.js"; // Import nommé

// Fonction pour créer un utilisateur
const createUser = async (username, password, email, role) => {
 const user = await prisma.user.create({
  data: {
   username,
   password,
   email,
   role,
  },
 });
 return user;
};

// Fonction pour récupérer tous les utilisateurs
const findAllUsers = async () => {
 const users = await prisma.user.findMany(); // Utilisation de la méthode findMany pour obtenir tous les utilisateurs
 return users;
};

// Fonction pour trouver un utilisateur par son ID
const findUserById = async (id) => {
 const user = await prisma.user.findUnique({
  where: { id: parseInt(id) }, // Assure-toi que l'ID est un entier
 });
 return user;
};

// Fonction pour trouver un utilisateur par son email
const findUserByEmail = async (email) => {
 const user = await prisma.user.findUnique({
  where: { email },
 });
 return user;
};

// Fonction pour vérifier le mot de passe
const checkPassword = async (email, password) => {
 const user = await findUserByEmail(email);
 if (user && user.password === password) {
  return true;
 }
 return false;
};

// Fonction pour mettre à jour un utilisateur
const updateUser = async (id, data) => {
 const updatedUser = await prisma.user.update({
  where: { id: parseInt(id) },
  data,
 });
 return updatedUser;
};

// Fonction pour supprimer un utilisateur
const deleteUser = async (id) => {
 await prisma.user.delete({
  where: { id: parseInt(id) }, // Assure-toi que l'ID est un entier
 });
};

// Exportation par défaut
export default {
 createUser,
 findAllUsers,
 findUserById,
 findUserByEmail,
 checkPassword,
 updateUser,
 deleteUser,
};
