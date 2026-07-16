document.addEventListener('DOMContentLoaded', () => {
    const cart = window.cartData || [];
    const total = window.cartTotal || 0;

    const preview = document.getElementById('message-preview');
    const nomInput = document.getElementById('nom');
    const whatsappInput = document.getElementById('whatsapp');
    const villeInput = document.getElementById('ville');
    const adresseInput = document.getElementById('adresse');

    // Formate un nombre en "9 000" au lieu de "9000"
    function formatPrice(n) {
        return n.toLocaleString('fr-FR').replace(/\u202F|,/g, ' ');
    }

    // Génère une référence unique pour la commande
    function generateRef() {
        if (!window.orderRef) {
            window.orderRef = Math.floor(1000 + Math.random() * 9000);
        }
        return window.orderRef;
    }

    // Transforme { Taille: 'Noir S' } en "Taille: Noir S"
    // Gère aussi plusieurs options si un jour tu ajoutes ex: { Taille: '...', Couleur: '...' }
    function formatOptions(options) {
        if (!options || Object.keys(options).length === 0) return '';
        return Object.entries(options)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ');
    }

    function buildProductList() {
        return cart.map((item, index) => {
            let block = `${index + 1}. ${item.name}\n`;

            const optionsText = formatOptions(item.options);
            if (optionsText) {
                block += `${optionsText}\n`;
            }

            block += `Prix unitaire: ${formatPrice(item.price)} FCFA\n`;
            block += `Quantité: ${item.quantity}\n`;

            return block;
        }).join('\n');
    }

    // Construit le message complet
    function buildMessage() {
        const nom = nomInput.value.trim() || '...';
        const tel = whatsappInput.value.trim() || '...';
        const ville = villeInput.value.trim() || '...';
        const adresse = adresseInput.value.trim();
        const lieu = adresse ? `${ville} - ${adresse}` : ville;

        return `Nouvelle commande SiteWeb
________________________________

${buildProductList()}
________________________________
Total: ${formatPrice(total)} FCFA
________________________________

Client: ${nom}
Tél: +225 ${tel}
Lieu: ${lieu}
________________________________

Réf: #${generateRef()}`;
    }

    // Met à jour l'aperçu
    function updatePreview() {
        preview.textContent = buildMessage();
    }

    // Écoute les champs du formulaire pour mise à jour en direct
    [nomInput, whatsappInput, villeInput, adresseInput].forEach(input => {
        input.addEventListener('input', updatePreview);
    });

    // Premier rendu au chargement
    updatePreview();
});