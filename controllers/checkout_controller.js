exports.getCheckout = (req, res) => {
    // On récupère le panier stocké en session (tableau vide si inexistant)
    const cart = req.session.cart || [];

    // Petit calcul utile pour la vue : total et nombre d'articles
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    console.log(cart);

    res.render('checkout', {
        cart,
        total,
        itemCount
    });
};