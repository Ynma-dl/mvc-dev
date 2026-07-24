// L'ordre logique de progression du statut (cancelled est un état à part)
const STATUS_FLOW = ['pending', 'confirmed', 'delivered'];


// Garde en mémoire la commande actuellement ouverte dans la popup
let currentOrder = null;

function getNextStatus(current) {
    const index = STATUS_FLOW.indexOf(current);
    if (index === -1 || index === STATUS_FLOW.length - 1) return null;
    return STATUS_FLOW[index + 1];
}

function getNextStatusLabel(nextStatus) {
    switch (nextStatus) {
        case 'confirmed': return 'Confirmer';
        case 'delivered': return 'Marquer livrée';
        default: return null;
    }
}

/**
 * Active/désactive les boutons selon l'état actuel de la commande
 */
function updatePopupActions(order) {
    const cancelBtn = document.getElementById('popupCancelBtn');
    const nextBtn = document.getElementById('popupNextBtn');
    const nextLabel = document.getElementById('popupNextLabel');

    const isCancelled = order.order_status === 'cancelled';
    const isDelivered = order.order_status === 'delivered';
    const nextStatus = getNextStatus(order.order_status);

    // "Annuler" désactivé si déjà annulée ou déjà livrée (trop tard)
    cancelBtn.disabled = isCancelled || isDelivered;

    if (isCancelled || !nextStatus) {
        nextBtn.disabled = true;
        nextLabel.textContent = isDelivered ? 'Commande terminée' : 'Aucune suite';
    } else {
        nextBtn.disabled = false;
        nextLabel.textContent = getNextStatusLabel(nextStatus);
    }
}

function updateStatusBadge(status) {
    const statusEl = document.getElementById("popupStatus");
    statusEl.className = `popup-status-badge ${getStatusClass(status)}`;
    statusEl.textContent = getStatusLabel(status);
}

/**
 * Met à jour visuellement la ligne correspondante dans la liste des
 * commandes, sans recharger toute la page
 */
function refreshOrderRowInList(orderId, newStatus) {
    const row = document.querySelector(`.orderViewDiv[data-order-id="${orderId}"]`);
    if (!row) return;

    const statusClass = getStatusClass(newStatus);
    const statusLabel = getStatusLabel(newStatus);

    const dot = row.querySelector('.orderStatusDot');
    const badge = row.querySelector('.orderStatusBadge');

    if (dot) dot.className = `orderStatusDot ${statusClass}`;
    if (badge) {
        badge.className = `orderStatusBadge ${statusClass}`;
        badge.textContent = statusLabel;
    }
}

/**
 * Appelle l'API pour changer le statut d'une commande
 */
async function updateOrderStatus(id, status) {
    const response = await fetch(`/admin-complique/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
    });

    if (!response.ok) {
        throw new Error('Échec de la mise à jour du statut');
    }

    return response.json();
}

async function handleStatusChange(newStatus) {
    if (!currentOrder) return;

    try {
        await updateOrderStatus(currentOrder.id, newStatus);

        currentOrder.order_status = newStatus;
        updateStatusBadge(newStatus);
        updatePopupActions(currentOrder);
        refreshOrderRowInList(currentOrder.id, newStatus);
    } catch (err) {
        console.error(err);
        alert("Impossible de mettre à jour le statut de la commande.");
    }
}

/**
 * Réutilise le même mapping de statut que renderOrderViews
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

function getStatusLabel(status) {
    switch (status) {
        case 'pending': return 'En attente';
        case 'confirmed': return 'Confirmée';
        case 'delivered': return 'Livrée';
        case 'cancelled': return 'Annulée';
        default: return 'Inconnu';
    }
}

function escapeHTML(str) {
    return String(str ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function formatPrice(price) {
    return Number(price ?? 0).toLocaleString('fr-FR');
}

/**
 * Génère le HTML d'une ligne produit
 */
function renderProductRow(product) {
    const name = escapeHTML(product.name);
    const quantity = Number(product.quantity ?? 1);
    const price = formatPrice(product.price);

    const optionsHTML = product.options
        ? `<span class="popup-product-options">${escapeHTML(product.options)}</span>`
        : '';

    return `
        <div class="popup-product-row">
            <div class="popup-product-info">
                <span class="popup-product-name">${name}</span>
                ${optionsHTML}
            </div>
            <span class="popup-product-qty">x${quantity}</span>
            <span class="popup-product-price">${price} FCFA</span>
        </div>
    `;
}

/**
 * Remplit la popup avec les données d'une commande
 */
// --- Modification de fillPopup : mémoriser la commande + activer les boutons ---
function fillPopup(order) {
    currentOrder = order; // <-- ajouté

    document.getElementById("popupCustomer").textContent = order.customer_name ?? 'Client inconnu';
    document.getElementById("popupPhone").textContent = order.phone ?? '—';
    document.getElementById("popupAddress").textContent = order.address ?? '—';

    const dateEl = document.getElementById("popupDate");
    if (order.created_at) {
        const date = new Date(order.created_at);
        dateEl.textContent = date.toLocaleString('fr-FR', {
            day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
        });
    } else {
        dateEl.textContent = '—';
    }

    updateStatusBadge(order.order_status);

    const productsDiv = document.getElementById("popupProducts");
    if (!order.products || order.products.length === 0) {
        productsDiv.innerHTML = '<p class="popup-products-empty">Aucun produit dans cette commande.</p>';
    } else {
        productsDiv.innerHTML = order.products.map(renderProductRow).join('');
    }

    document.getElementById("popupTotal").textContent = formatPrice(order.total) + " FCFA";

    updatePopupActions(order); // <-- ajouté
}

// --- Listeners des boutons, à ajouter dans le DOMContentLoaded existant ---
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('popupCancelBtn').addEventListener('click', () => {
        if (!currentOrder) return;
        if (!confirm('Voulez-vous vraiment annuler cette commande ?')) return;
        handleStatusChange('cancelled');
    });

    document.getElementById('popupNextBtn').addEventListener('click', () => {
        if (!currentOrder) return;
        const next = getNextStatus(currentOrder.order_status);
        if (!next) return;
        handleStatusChange(next);
    });
});

async function getOder(id) {


    const response = await fetch(`/admin-complique/orders/${id}`);


    const order = await response.json();

    return order

}

/**
 * Ouvre la popup avec les données d'une commande
 */
function openOrderPopup(order) {
    fillPopup(order);
    document.getElementById("orderPopupOverlay").classList.add("active");
}

function closeOrderPopup() {
    document.getElementById("orderPopupOverlay").classList.remove("active");
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("popupClose")
        .addEventListener("click", closeOrderPopup);

    // Fermeture en cliquant sur l'overlay (en dehors de la carte)
    document.getElementById("orderPopupOverlay")
        .addEventListener("click", function (e) {
            if (e.target === this) closeOrderPopup();
        });
});

const orders = document.querySelectorAll(".orderViewDiv");


console.log("commandes trouvées :", orders.length);


orders.forEach(orderEl => {
    orderEl.addEventListener("click", async () => {
        const orderId = orderEl.dataset.orderId;
        console.log("Commande sélectionnée :", orderId);

        try {
            const order = await getOder(orderId);
            openOrderPopup(order);
        } catch (err) {
            console.error("Erreur lors du chargement de la commande :", err);
        }
    });
});