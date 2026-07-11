const ProductModel = require("../models/ProductModel.js");
const pool = require("../database/db.js");

function createProductCard(collection) {

    let html = "";

    collection.forEach(product => {

        html += `
            <a href="/product/${product.id}">
                <div class="cloth-card">

                    <div class="cloth-img" 
                    style="background-image: url('${product.image_url}')">
                    </div>

                    <div class="cloth-info">
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <p>${product.price} €</p>
                    </div>
                </div>
            </a>
        `;
    });

    return html;
}


async function displayCollections(allCollections, limit = null) {
    
    let index = 0;

    const total = allCollections.length;

    // Si tout a été affiché
    if (index >= total) {
        return "";
    }

    limit = limit ?? (total - index);

    const end = Math.min(index + limit, total);

    let html = "";

    for (; index < end; index++) {

        const collection = allCollections[index].category;

        html += `
            <h1 class="title1">
                ${collection}
            </h1>
        `;

        const products = await ProductModel.getProductsByCollection(
            pool,
            collection
        );

        if (products.length === 0) {

            html += `
                <p>Aucun vêtement disponible pour le moment.</p>
            `;

        } else {

            html += createProductCard(products);

        }
    }

    return html;
}

function resetCollectionsDisplay(req) {
    req.session.collection_index = 0;
}

module.exports = displayCollections;