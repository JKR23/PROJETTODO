import fetch from 'node-fetch';

// Fonction pour tester une route d'API
async function testApiRoute(url) {
  try {
    console.log(`Test de la route: ${url}`);
    const response = await fetch(url);
    const status = response.status;
    console.log(`Statut de réponse: ${status}`);
    
    let data;
    try {
      data = await response.json();
      console.log('Réponse:', data);
    } catch (e) {
      console.log('Pas de données JSON dans la réponse');
    }
    
    return { success: response.ok, status, data };
  } catch (error) {
    console.error(`Erreur lors de l'accès à ${url}:`, error.message);
    return { success: false, error: error.message };
  }
}

// Tester toutes les routes importantes
async function testAllRoutes() {
  console.log('===== TEST DES ROUTES API =====');
  
  // Test des routes de statut
  await testApiRoute('http://localhost:5000/api/task/status/TODO');
  await testApiRoute('http://localhost:5000/api/task/status/IN_PROGRESS');
  await testApiRoute('http://localhost:5000/api/task/status/IN_REVIEW');
  await testApiRoute('http://localhost:5000/api/task/status/DONE');
  
  // Test de la route principale des tâches
  await testApiRoute('http://localhost:5000/api/task');
}

testAllRoutes(); 