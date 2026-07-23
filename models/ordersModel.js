/**
 * Récupère les commandes depuis la base et génère leur HTML
 *
 * @param {number} limit - Nombre de commandes à récupérer (par défaut 10)
 * @returns {Promise<string>} HTML généré, prêt à être inséré
 */
async function renderOrderViews(pool, limit = 10) {
    let orders;

    try {
        const today = new Date().toISOString().slice(0, 10);

        const rows = await pool.query(
            `SELECT id, customer_name, customer_address, total, order_status
     FROM orders
     WHERE created_at >= ?
       AND created_at < DATE_ADD(?, INTERVAL 1 DAY)
     ORDER BY created_at DESC
     LIMIT ?`,
            [
                today + " 00:00:00",
                today + " 00:00:00",
                limit
            ]
        );

        orders = rows;

    } catch (err) {
        console.error('Erreur lors de la récupération des commandes :', err);
        return '<p class="noOrders">Erreur lors du chargement des commandes.</p>';
    }

    if (!Array.isArray(orders) || orders.length === 0) {
        return '<p class="noOrders">Aucune commande trouvée.</p>';
    }

    const ordersHTML = orders.map(order => {
        const id = order.id ?? '';
        const name = order.customer_name ?? 'Client inconnu';
        const total = formatPrice(order.total ?? 0);
        const status = order.order_status ?? 'pending';
        const statusClass = getStatusClass(status);
        const statusLabel = getStatusLabel(status);
        const adress = order.customer_address;

        return `
            <div class="orderViewDiv" data-order-id="${id}">
                <div class="orderStatusDot ${statusClass}"></div>
                <div class="orderInfo">
                    <span class="orderCustomer">${name}</span>
                    <span class="orderAddress">${adress}</span>
                    <span class="orderTotal">${total} FCFA</span>
                </div>
                <span class="orderStatusBadge ${statusClass}">${statusLabel}</span>
            </div>
        `;
    }).join('');

    return `<div id="orderListContainer">${ordersHTML}</div>`;
}

/**
 * Retourne la classe CSS correspondant au statut de la commande
 */
function getStatusClass(status) {
    switch (status) {
        case 'pending': return 'status-pending';
        case 'confirmed': return 'status-success';
        case 'delivered': return 'status-success';
        case 'cancelled': return 'status-danger';
        default: return 'status-pending';
    }
}

/**
 * Retourne le libellé lisible du statut
 */
function getStatusLabel(status) {
    switch (status) {
        case 'pending': return 'En attente';
        case 'confirmed': return 'Confirmée';
        case 'delivered': return 'Livrée';
        case 'cancelled': return 'Annulée';
        default: return 'Inconnu';
    }
}

/**
 * Formate un nombre en prix lisible avec espaces (ex: 29876 -> "29 876")
 */
function formatPrice(price) {
    return Number(price).toLocaleString('fr-FR');
}

module.exports = {
    renderOrderViews
}