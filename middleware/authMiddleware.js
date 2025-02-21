// src/middleware/authMiddleware.js
import jwt from "jsonwebtoken"; // Utilisation de l'import ES6

// Fonction pour vérifier le token
export const verifyToken = (req, res, next) => {
 const token = req.headers["authorization"];
 if (!token) return res.status(403).json({ message: "Token manquant" });

 jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
  if (err) return res.status(403).json({ message: "Token invalide" });
  req.user = user;
  next();
 });
};

// Middleware pour vérifier si l'utilisateur est un administrateur
export const isAdmin = (req, res, next) => {
 if (req.user.role !== "ADMIN") {
  return res.status(403).json({ message: "Accès interdit" });
 }
 next();
};
