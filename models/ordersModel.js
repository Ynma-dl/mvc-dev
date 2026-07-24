/**
 * Récupère les commandes depuis la base et génère leur HTML
 *
 * @returns {Promise<string>} HTML généré, prêt à être inséré
 */
async function renderOrderViews(pool) {
    let orders;

    try {
        const today = new Date().toISOString().slice(0, 10);

        const rows = await pool.query(
            `SELECT id, customer_name, customer_address, total, order_status
     FROM orders
    
     ORDER BY created_at DESC`
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

    return `<div class="orderListContainer">${ordersHTML}</div>`;
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


function fillPopup(order) {


    document.getElementById("popupCustomer")
        .textContent = order.customer_name;


    document.getElementById("popupPhone")
        .textContent = order.phone;


    const productsDiv =
        document.getElementById("popupProducts");


    productsDiv.innerHTML = "";


    order.products.forEach(product => {


        productsDiv.innerHTML += `

<div>

<h4>${product.name}</h4>

<p>
Quantité : ${product.quantity}
</p>

<p>
Prix : ${product.price}
</p>

</div>

`;


    });


    document.getElementById("popupTotal")
        .textContent =
        order.total + " FCFA";


}

async function getById(pool, id) {

    const rows = await pool.query(
        `
        SELECT 
            orders.id,
            orders.customer_name,
            orders.customer_phone,
            orders.customer_address,
            orders.total,
            orders.order_status,
            orders.created_at,

            order_items.product_id,
            order_items.product_name,
            order_items.quantity,
            order_items.unit_price,
            order_items.selected_options

        FROM orders

        LEFT JOIN order_items
        ON orders.id = order_items.order_id

        WHERE orders.id = ?

        `,
        [id]
    );


    if (rows.length === 0) {
        return null;
    }



    const order = {

        id: rows[0].id,

        customer_name: rows[0].customer_name,


        phone: rows[0].customer_phone,

        address: rows[0].customer_address,

        total: rows[0].total,

        order_status: rows[0].order_status,

        created_at: rows[0].created_at,

        products: []

    };



    rows.forEach(row => {


        order.products.push({

            product_id: row.product_id,

            name: row.product_name,

            quantity: row.quantity,

            price: row.unit_price,

            options: row.selected_options

        });


    });



    return order;

}

// ordersModels.js
async function updateStatus(pool, id, status) {
    const result = await pool.query(
        'UPDATE orders SET order_status = ? WHERE id = ?',
        [status, id]
    );
    return result;
}


module.exports = {
    renderOrderViews,
    getById,
    updateStatus
}