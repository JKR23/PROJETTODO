import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Création des statuts
  const statuses = [
    { name: 'TODO' },
    { name: 'IN_PROGRESS' },
    { name: 'IN_REVIEW' },
    { name: 'DONE' }
  ];

  // Création des priorités
  const priorities = [
    { name: 'FAIBLE' },
    { name: 'MOYENNE' },
    { name: 'HAUTE' }
  ];

  // Création des rôles
  const roles = [
    { name: 'ADMIN' },
    { name: 'USER' }
  ];

  // Ajout des statuts
  for (const status of statuses) {
    await prisma.status.upsert({
      where: { name: status.name },
      update: {},
      create: status
    });
  }

  // Ajout des priorités
  for (const priority of priorities) {
    await prisma.priority.upsert({
      where: { name: priority.name },
      update: {},
      create: priority
    });
  }

  // Ajout des rôles
  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role
    });
  }

  // Création d'un utilisateur par défaut
  await prisma.user.upsert({
    where: { id: 1 },
    update: {},
    create: {
      username: 'Utilisateur1',
      email: 'default@example.com',
      password: '1234',
      roleId: 1
    }
  });

  console.log('Base de données initialisée avec succès!');
}

main()
  .catch((e) => {
    console.error('Erreur pendant l\'initialisation:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 