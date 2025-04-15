// Éléments du DOM pour les compteurs
const todoCounter = document.getElementById('todo-count');
const progressCounter = document.getElementById('progress-count');
const reviewCounter = document.getElementById('review-count');
const doneCounter = document.getElementById('done-count');
const editProfileBtn = document.getElementById('edit-profile');
const changePasswordBtn = document.getElementById('change-password');

// Fonction pour récupérer les statistiques de l'utilisateur
const loadUserStats = async () => {
    try {
        // Récupération du nombre de tâches TODO
        const todoResponse = await fetch('/api/task/status/TODO');
        if (todoResponse.ok) {
            const todoData = await todoResponse.json();
            todoCounter.textContent = todoData.length;
        }
        
        // Récupération du nombre de tâches IN_PROGRESS
        const progressResponse = await fetch('/api/task/status/IN_PROGRESS');
        if (progressResponse.ok) {
            const progressData = await progressResponse.json();
            progressCounter.textContent = progressData.length;
        }
        
        // Récupération du nombre de tâches IN_REVIEW
        const reviewResponse = await fetch('/api/task/status/IN_REVIEW');
        if (reviewResponse.ok) {
            const reviewData = await reviewResponse.json();
            reviewCounter.textContent = reviewData.length;
        } else {
            // Si le statut IN_REVIEW n'existe pas encore, on affiche 0
            reviewCounter.textContent = '0';
        }
        
        // Récupération du nombre de tâches DONE
        const doneResponse = await fetch('/api/task/status/DONE');
        if (doneResponse.ok) {
            const doneData = await doneResponse.json();
            doneCounter.textContent = doneData.length;
        }
    } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
    }
};

// Fonction pour ajouter des animations aux compteurs
const animateCounters = () => {
    const counters = document.querySelectorAll('.stat-count');
    
    counters.forEach(counter => {
        const finalValue = parseInt(counter.textContent);
        let currentValue = 0;
        
        const increment = Math.ceil(finalValue / 20); // Animation en 20 étapes maximum
        
        const updateCounter = () => {
            currentValue += increment;
            
            if (currentValue > finalValue) {
                counter.textContent = finalValue;
            } else {
                counter.textContent = currentValue;
                setTimeout(updateCounter, 50);
            }
        };
        
        updateCounter();
    });
};

// Gestion des événements pour les boutons du profil
if (editProfileBtn) {
    editProfileBtn.addEventListener('click', () => {
        alert('La fonctionnalité de modification du profil sera disponible prochainement.');
    });
}

if (changePasswordBtn) {
    changePasswordBtn.addEventListener('click', () => {
        alert('La fonctionnalité de changement de mot de passe sera disponible prochainement.');
    });
}

// Chargement des statistiques au chargement de la page
document.addEventListener('DOMContentLoaded', async () => {
    await loadUserStats();
    animateCounters();
}); 