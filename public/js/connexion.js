// Sélection des éléments du DOM
const inputCourriel = document.getElementById("input-courriel");
const inputMotDePasse = document.getElementById("input-mot-de-passe");
const formConnexion = document.getElementById("form-connexion");
const errorMessage = document.getElementById("error-message");

// Vérifier si l'utilisateur vient de s'inscrire
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('registered') === 'true') {
    // Afficher un message de succès pour l'inscription
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.textContent = 'Inscription réussie ! Vous pouvez maintenant vous connecter.';
    document.querySelector('.auth-card').insertBefore(successMessage, formConnexion);
    
    // Supprimer le message après 5 secondes
    setTimeout(() => {
        successMessage.remove();
    }, 5000);
}

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

// Gestion de la soumission du formulaire
formConnexion.addEventListener("submit", async (event) => {
    event.preventDefault();
    resetErrors();

    // Validation de base des champs
    if (!inputCourriel.value.trim()) {
        return showError('Veuillez entrer votre email');
    }
    
    if (!inputMotDePasse.value) {
        return showError('Veuillez entrer votre mot de passe');
    }

    // Préparation des données à envoyer
    const data = {
        email: inputCourriel.value.trim(),
        password: inputMotDePasse.value,
    };

    try {
        const response = await fetch("/connexion", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            // Si l'authentification est réussie, on redirige vers la page d'accueil
            window.location.replace("/");
        } else {
            // Si l'authentification échoue, on affiche le message d'erreur
            const responseData = await response.json();
            
            if (responseData.erreur === "mauvais_utilisateur") {
                showError("L'adresse email n'est pas associée à un compte");
            } else if (responseData.erreur === "mauvais_mot_de_passe") {
                showError("Mot de passe incorrect");
            } else {
                showError("Échec de la connexion : " + responseData.erreur);
            }
        }
    } catch (error) {
        console.error("Erreur lors de la connexion:", error);
        showError("Une erreur est survenue lors de la communication avec le serveur");
    }
});
