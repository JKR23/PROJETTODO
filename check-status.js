import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkStatuses() {
  try {
    console.log('Vérification des statuts dans la base de données...');
    
    // Récupérer tous les statuts
    const statuses = await prisma.status.findMany();
    console.log('Statuts trouvés:', statuses);
    
    // Vérifier si les statuts requis existent
    const requiredStatuses = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'];
    
    for (const statusName of requiredStatuses) {
      const status = statuses.find(s => s.name === statusName);
      
      if (!status) {
        console.log(`Le statut ${statusName} n'existe pas. Création en cours...`);
        await prisma.status.create({
          data: { name: statusName }
        });
        console.log(`Statut ${statusName} créé avec succès.`);
      } else {
        console.log(`Le statut ${statusName} existe avec l'ID ${status.id}`);
      }
    }
    
    // Vérifier à nouveau après les modifications potentielles
    const updatedStatuses = await prisma.status.findMany();
    console.log('Statuts après vérification:', updatedStatuses);
    
  } catch (error) {
    console.error('Erreur lors de la vérification des statuts:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkStatuses(); 