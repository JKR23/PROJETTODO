// prismaClient.js
import { PrismaClient } from "@prisma/client"; // Utilisation de 'import'

const prisma = new PrismaClient();

export { prisma }; // Utilisation de 'export' pour l'exportation nommée
