import { PrismaClient } from "@prisma/client";

import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Créer un utilisateur avec un rôle par défaut
export const createUser = async (username, password, email) => {
 try {
  console.log("Creating a new user with username:", username);

  // Récupérer le rôle "USER" par défaut
  const defaultRole = await prisma.role.findUnique({
   where: { name: "USER" },
  });

  if (!defaultRole) {
   console.error("Default role 'USER' not found. Available roles:");
   const roles = await prisma.role.findMany();
   console.log(roles);
   throw new Error("Default role 'USER' not found");
  }

  const user = await prisma.user.create({
   data: {
    username,
    email,
    password: await bcrypt.hash(password, 10),
    roleId: defaultRole.id, // Attribuer le rôle "USER" par défaut
   },
  });
  console.log("User created successfully:", user);
  return user;
 } catch (error) {
  console.error("Error creating user:", error);
  throw new Error("Error creating user: " + error.message);
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
  console.log("Fetching user by email:", email);
  const user = await prisma.user.findUnique({
   where: { email: email },
  });
  console.log("User found:", user);
  return user;
 } catch (error) {
  console.error("Error fetching user by email:", email, error);
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

// Supprimer un utilisateur : model
export const deleteUser = async (id) => {
 try {
  console.log("Deleting user with ID:", id);
  await prisma.user.delete({
   where: { id },
  });
  console.log("User deleted successfully:", id);

  // Optional: Log a confirmation message if you want to keep it here as well
  console.log(`User with ID ${id} has been deleted successfully.`);
 } catch (error) {
  console.error("Error deleting user with ID:", id, error);
  throw new Error("Error deleting user");
 }
};

// Mettre à jour le rôle d'un utilisateur
export const updateUserRole = async (userId, roleId) => {
 try {
  console.log(
   "Updating role for user with ID:",
   userId,
   "New role ID:",
   roleId
  );
  const updatedUser = await prisma.user.update({
   where: { id: userId },
   data: { roleId },
  });
  console.log("User role updated successfully:", updatedUser);
  return updatedUser;
 } catch (error) {
  console.error("Error updating user role with ID:", userId, error);
  throw new Error("Error updating user role");
 }
};

// Connexion de l'utilisateur
export const loginUser = async (email, password) => {
 try {
  console.log("Logging in user with email:", email);

  // Récupérer l'utilisateur par son email
  const user = await prisma.user.findUnique({
   where: { email },
  });

  if (!user) {
   throw new Error("User not found");
  }

  // Vérifier le mot de passe
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
   throw new Error("Invalid password");
  }

  console.log("User logged in successfully:", user);
  return user;
 } catch (error) {
  console.error("Error logging in user:", error);
  throw new Error("Error logging in user");
 }
};
