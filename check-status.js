import "dotenv/config";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkAndCreateStatuses() {
  try {
    console.log('Vérification des statuts existants...');
    
    // Liste des statuts nécessaires
    const requiredStatuses = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'];
    
    // Récupération des statuts existants
    const existingStatuses = await prisma.status.findMany();
    console.log('Statuts existants:', existingStatuses);
    
    // Vérification et création des statuts manquants
    for (const statusName of requiredStatuses) {
      const exists = existingStatuses.some(status => status.name === statusName);
      
      if (!exists) {
        console.log(`Le statut "${statusName}" n'existe pas. Création en cours...`);
        const newStatus = await prisma.status.create({
          data: { name: statusName }
        });
        console.log(`Statut "${statusName}" créé avec l'ID ${newStatus.id}`);
      } else {
        console.log(`Le statut "${statusName}" existe déjà.`);
      }
    }
    
    console.log('Vérification et création des statuts terminée.');
    
  } catch (error) {
    console.error('Erreur lors de la vérification/création des statuts:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécution de la fonction
checkAndCreateStatuses(); 