import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function createTestTasks() {
  try {
    console.log('Création de tâches de test...');
    
    // Vérification de l'utilisateur existant
    const user = await prisma.user.findFirst();
    if (!user) {
      console.error('Aucun utilisateur trouvé. Création impossible.');
      return;
    }
    
    console.log('Utilisateur trouvé:', user);
    
    // Liste des tâches de test à créer
    const testTasks = [
      {
        title: 'Tâche TODO de test',
        description: 'Description de la tâche TODO',
        statusId: 1, // TODO
        priorityId: 2, // MOYENNE
        userId: user.id,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Dans une semaine
      },
      {
        title: 'Tâche IN_PROGRESS de test',
        description: 'Description de la tâche IN_PROGRESS',
        statusId: 2, // IN_PROGRESS
        priorityId: 2, // MOYENNE
        userId: user.id,
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // Dans 5 jours
      },
      {
        title: 'Tâche IN_REVIEW de test',
        description: 'Description de la tâche IN_REVIEW',
        statusId: 3, // IN_REVIEW
        priorityId: 1, // FAIBLE
        userId: user.id,
        deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Dans 3 jours
      },
      {
        title: 'Tâche DONE de test',
        description: 'Description de la tâche DONE',
        statusId: 4, // DONE
        priorityId: 3, // HAUTE
        userId: user.id,
        deadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Il y a 2 jours
      }
    ];
    
    // Création des tâches
    for (const taskData of testTasks) {
      console.log(`Création de la tâche "${taskData.title}"...`);
      const task = await prisma.task.create({ data: taskData });
      console.log(`Tâche créée avec l'ID ${task.id}`);
    }
    
    console.log('Toutes les tâches de test ont été créées avec succès.');
    
  } catch (error) {
    console.error('Erreur lors de la création des tâches de test:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestTasks(); 