const express = require('express');
const router = express.Router();

// Transforme { Couleur: "Noir", Pointure: "42" } en "Couleur:Noir|Pointure:42"
// (triée par clé pour que l'ordre n'influence jamais la comparaison)
function serializeOptions(options = {}) {
    return Object.keys(options)
        .sort()
        .map(key => `${key}:${options[key]}`)
        .join('|');
}

// Ajouter un produit
router.post('/add', (req, res) => {
    const { id, name, price, options, quantity, image } = req.body;

    if (!req.session.cart) {
        req.session.cart = [];
    }

    const optionsKey = serializeOptions(options);

    const existingItem = req.session.cart.find(
        item => item.id === id && serializeOptions(item.options) === optionsKey
    );

    if (existingItem) {
        existingItem.quantity = Number(existingItem.quantity) + Number(quantity);
    } else {
        req.session.cart.push({ id, name, price, options, quantity, image });
    }

    res.json({ success: true, cart: req.session.cart });
});

// Récupérer le panier (pour la popup)
router.get('/data', (req, res) => {
    res.json({ cart: req.session.cart || [] });
});

// Supprimer un produit
router.post('/remove', (req, res) => {
    const { id, options } = req.body;
    const optionsKey = serializeOptions(options);

    req.session.cart = (req.session.cart || []).filter(
        item => !(item.id === id && serializeOptions(item.options) === optionsKey)
    );

    res.json({ success: true, cart: req.session.cart });
});

module.exports = router;