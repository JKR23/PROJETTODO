import "dotenv/config";

// Importer les routes
import historyRoutes from "./routes/historyRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js"; // Ajout des routes task

// Importation des fichiers et librairies
import express, { json } from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import cspOption from "./csp-options.js";

// Création du serveur express
const app = express();

// Ajout de middlewares
app.use(helmet(cspOption));
app.use(compression());
app.use(cors());
app.use(json());

// Middleware intégré à Express pour gérer la partie statique du serveur
app.use(express.static("public"));

// Ajout des routes
app.use("/api/history", historyRoutes);
app.use("/api/users", userRoutes);
app.use("/api/task", taskRoutes); // Ajout des routes de réservation

// Gestion des erreurs 404
app.use((request, response) => {
 response
  .status(404)
  .json({ error: `${request.originalUrl} Route introuvable.` });
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
 console.info("Serveur démarré :");
 console.info(`http://localhost:${PORT}`);
});
