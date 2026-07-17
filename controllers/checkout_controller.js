const { prepareCheckoutCart } = require("../utils/function");

exports.getCheckout = (req, res) => {
    // On récupère le panier stocké en session (tableau vide si inexistant)
    const cart = req.session.cart || [];

    // Petit calcul utile pour la vue : total et nombre d'articles

    const checkout = prepareCheckoutCart(cart);

    res.render('checkout', {
        cart: checkout.items,
        total: checkout.total
    });
};