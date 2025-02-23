import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Créer un utilisateur
export const createUser = async () => {
 try {
  console.log("Creating a new user");
  const user = await prisma.user.create({
   data: {
    username: "Utilisateur1", // Utilisateur par défaut
   },
  });
  console.log("User created successfully:", user);
  return user;
 } catch (error) {
  console.error("Error creating user:", error);
  throw new Error("Error creating user");
 }
};

// Récupérer tous les utilisateurs
export const getAllUsers = async () => {
 try {
  console.log("Fetching all users");
  const users = await prisma.user.findMany();
  console.log("Users retrieved:", users);
  return users;
 } catch (error) {
  console.error("Error fetching users:", error);
  throw new Error("Error fetching users");
 }
};

// Récupérer un utilisateur par son ID
export const getUserById = async (id) => {
 try {
  console.log("Fetching user by ID:", id);
  const user = await prisma.user.findUnique({
   where: { id },
  });
  console.log("User found:", user);
  return user;
 } catch (error) {
  console.error("Error fetching user by ID:", id, error);
  throw new Error("Error fetching user");
 }
};

// Récupérer un utilisateur par son email (ici username)
export const getUserByEmail = async (email) => {
 try {
  console.log("Fetching user by email (username):", email);
  const user = await prisma.user.findUnique({
   where: { username: email },
  });
  console.log("User found:", user);
  return user;
 } catch (error) {
  console.error("Error fetching user by email (username):", email, error);
  throw new Error("Error fetching user by email");
 }
};

// Mettre à jour un utilisateur
export const updateUser = async (id, username) => {
 try {
  console.log("Updating user with ID:", id, "New username:", username);
  const updatedUser = await prisma.user.update({
   where: { id },
   data: { username },
  });
  console.log("User updated successfully:", updatedUser);
  return updatedUser;
 } catch (error) {
  console.error("Error updating user with ID:", id, error);
  throw new Error("Error updating user");
 }
};

// Supprimer un utilisateur
export const deleteUser = async (id) => {
 try {
  console.log("Deleting user with ID:", id);
  await prisma.user.delete({
   where: { id },
  });
  console.log("User deleted successfully:", id);
 } catch (error) {
  console.error("Error deleting user with ID:", id, error);
  throw new Error("Error deleting user");
 }
};
