async function loadCart() {
    const res = await fetch('/cart/data');
    const data = await res.json();
    renderCart(data.cart);
}

function formatOptions(options) {
    if (!options) return '';
    return Object.entries(options)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
}

function renderCart(cart) {
    const container = document.getElementById('cart-items');
    container.innerHTML = '';
    let total = 0;

    

    cart.forEach(item => {
        total += item.price * item.quantity;

        // On encode l'objet options en JSON pour le stocker dans l'attribut data-option
        const optionsJSON = JSON.stringify(item.options || {});

        container.innerHTML += `
            <div class="cart-item" data-id="${item.id}" data-option='${optionsJSON}'>
                <img src="${item.image}" alt="${item.name}">
                <div>
                    <p>${item.name}</p>
                    <p>${formatOptions(item.options)}</p>
                    <p>${item.quantity} x ${item.price} FCFA</p>
                </div>
                <button class="remove-item">&times;</button>
            </div>
        `;
    });

    document.getElementById('cart-total-price').textContent = total;
}

async function updateCartSticker() {
    const res = await fetch("/cart/data");
    const data = await res.json();

    const count = data.cart.reduce(
        (sum, item) => sum + Number(item.quantity),
        0
    );

    document.querySelector(".cart-count").textContent = count;
}

// Délégation d'événement : un seul listener sur le container,
// qui fonctionne même quand le HTML est reconstruit à chaque renderCart()
document.getElementById('cart-items').addEventListener('click', async (e) => {
    const removeBtn = e.target.closest('.remove-item');
    if (!removeBtn) return;

    const cartItemDiv = removeBtn.closest('.cart-item');
    const id = cartItemDiv.dataset.id;
    const options = JSON.parse(cartItemDiv.dataset.option);

    const res = await fetch('/cart/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, options })
    });

    const data = await res.json();
    if (data.success) {
        renderCart(data.cart);
        updateCartSticker();
    }
});

function ouvrirMemeOnglet(link) {
    window.location.href = link;
}

const cartSticker = document.querySelector(".cart-sticker");

if (cartSticker) {
    cartSticker.addEventListener("click", () => {
        document.querySelector(".popup-overlay").classList.remove("hidden");
        document.querySelector("#cart-popup").classList.remove("hidden");
    });
}

document.addEventListener("DOMContentLoaded", () => {
    loadCart();
    updateCartSticker();
});