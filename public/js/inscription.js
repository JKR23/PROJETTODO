// Sélection des éléments du DOM
const form = document.getElementById('form-inscription');
const usernameInput = document.getElementById('input-nom');
const emailInput = document.getElementById('input-email');
const passwordInput = document.getElementById('input-password');
const passwordConfirmInput = document.getElementById('input-password-confirm');
const errorMessage = document.getElementById('error-message');

// Fonction pour afficher un message d'erreur
const showError = (message) => {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
};

// Fonction pour réinitialiser les messages d'erreur
const resetErrors = () => {
    errorMessage.textContent = '';
    errorMessage.style.display = 'none';
};

// Validation du formulaire à la soumission
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    resetErrors();

    // Récupération des valeurs
    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const passwordConfirm = passwordConfirmInput.value;

    // Validation basique
    if (username.length < 3) {
        return showError('Le nom d\'utilisateur doit contenir au moins 3 caractères');
    }

    if (!email.includes('@') || !email.includes('.')) {
        return showError('Veuillez entrer une adresse email valide');
    }

    if (password.length < 6) {
        return showError('Le mot de passe doit contenir au moins 6 caractères');
    }

    if (password !== passwordConfirm) {
        return showError('Les mots de passe ne correspondent pas');
    }

    try {
        // Envoi des données au serveur
        const response = await fetch('/inscription', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                email,
                password
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Redirection vers la page de connexion en cas de succès
            window.location.href = '/connexion?registered=true';
        } else {
            // Affichage du message d'erreur
            showError(data.message || 'Une erreur est survenue lors de l\'inscription');
        }
    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        showError('Une erreur est survenue lors de la communication avec le serveur');
    }
}); 