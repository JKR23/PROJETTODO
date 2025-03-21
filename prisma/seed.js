import { PrismaClient } from '@prisma/client';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtenir le chemin absolu du répertoire courant
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chemin absolu vers le fichier de base de données
const dbPath = path.join(__dirname, 'tododev.db');

// Création d'une instance de PrismaClient avec l'URL de la base de données
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: `file:${dbPath}`
    }
  }
});

async function main() {
  console.log('Début de l\'initialisation des données...');
  
  try {
    // Création des statuts par défaut
    const statuses = [
      { name: 'TODO' },
      { name: 'IN_PROGRESS' },
      { name: 'IN_REVIEW' },
      { name: 'DONE' }
    ];

    for (const status of statuses) {
      await prisma.status.upsert({
        where: { name: status.name },
        update: {},
        create: status,
      });
    }
    console.log('Statuts créés avec succès');

    // Création des priorités par défaut
    const priorities = [
      { name: 'Low' },
      { name: 'Medium' },
      { name: 'High' }
    ];

    for (const priority of priorities) {
      await prisma.priority.upsert({
        where: { name: priority.name },
        update: {},
        create: priority,
      });
    }
    console.log('Priorités créées avec succès');

    // Création de l'utilisateur admin par défaut
    await prisma.user.upsert({
      where: { username: 'admin' },
      update: {},
      create: {
        username: 'admin',
        password: 'admin123'
      },
    });
    console.log('Utilisateur admin créé avec succès');

    // Récupération des IDs des statuts, priorités et utilisateurs
    const todoStatus = await prisma.status.findUnique({ where: { name: 'TODO' } });
    const inProgressStatus = await prisma.status.findUnique({ where: { name: 'IN_PROGRESS' } });
    const inReviewStatus = await prisma.status.findUnique({ where: { name: 'IN_REVIEW' } });
    const doneStatus = await prisma.status.findUnique({ where: { name: 'DONE' } });
    
    const lowPriority = await prisma.priority.findUnique({ where: { name: 'Low' } });
    const mediumPriority = await prisma.priority.findUnique({ where: { name: 'Medium' } });
    const highPriority = await prisma.priority.findUnique({ where: { name: 'High' } });
    
    const adminUser = await prisma.user.findUnique({ where: { username: 'admin' } });

    // Création de tâches de test pour chaque statut
    const tasks = [
      {
        title: 'Finaliser le design',
        description: 'Terminer le design de l\'interface utilisateur',
        deadline: new Date('2025-04-15'),
        statusId: todoStatus.id,
        priorityId: highPriority.id,
        userId: adminUser.id
      },
      {
        title: 'Corriger les bugs',
        description: 'Résoudre les problèmes signalés par les utilisateurs',
        deadline: new Date('2025-04-10'),
        statusId: inProgressStatus.id,
        priorityId: mediumPriority.id,
        userId: adminUser.id
      },
      {
        title: 'Tester les fonctionnalités',
        description: 'Vérifier que toutes les fonctionnalités marchent correctement',
        deadline: new Date('2025-04-05'),
        statusId: inReviewStatus.id,
        priorityId: highPriority.id,
        userId: adminUser.id
      },
      {
        title: 'Documentation',
        description: 'Rédiger la documentation pour les utilisateurs',
        deadline: new Date('2025-03-30'),
        statusId: doneStatus.id,
        priorityId: lowPriority.id,
        userId: adminUser.id
      },
      {
        title: 'Ajouter des filtres',
        description: 'Implémenter des filtres pour les tâches',
        deadline: new Date('2025-04-20'),
        statusId: todoStatus.id,
        priorityId: mediumPriority.id,
        userId: adminUser.id
      },
      {
        title: 'Optimiser les performances',
        description: 'Améliorer les temps de chargement',
        deadline: new Date('2025-04-12'),
        statusId: inProgressStatus.id,
        priorityId: highPriority.id,
        userId: adminUser.id
      },
      {
        title: 'Réviser le code',
        description: 'Faire une revue complète du code source',
        deadline: new Date('2025-04-08'),
        statusId: inReviewStatus.id,
        priorityId: mediumPriority.id,
        userId: adminUser.id
      },
      {
        title: 'Déploiement',
        description: 'Mettre en production la nouvelle version',
        deadline: new Date('2025-03-25'),
        statusId: doneStatus.id,
        priorityId: highPriority.id,
        userId: adminUser.id
      }
    ];

    // Suppression des tâches existantes pour éviter les doublons
    await prisma.task.deleteMany({});
    
    // Création des nouvelles tâches
    for (const task of tasks) {
      await prisma.task.create({
        data: task
      });
    }
    console.log('Tâches de test créées avec succès');

    console.log('Initialisation des données terminée avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'initialisation des données:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error('Erreur lors de l\'initialisation des données:', e);
    process.exit(1);
  });
