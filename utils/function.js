const ProductModel = require("../models/ProductModel.js");
const pool = require("../database/db.js");

function createProductCard(collection) {

    let html = "";

    collection.forEach(product => {
        const product_imgs = product.images_url.split(",");

        html += `
            <a href="/product/${product.slug}">
                <div class="cloth-card">

                    <div class="cloth-img" 
                    style="background-image: url('${product_imgs[0]}')">
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

// Préparer le récapitulatif du panier pour checkout
function prepareCheckoutCart(cart = []) {

    const items = cart.map(item => ({
        ...item,
        optionsText: item.options
            ? Object.entries(item.options)
                .map(([key, value]) => `${key}: ${value}`)
                .join(", ")
            : ""
    }));

    const total = cart.reduce((sum, item) => {
        return sum + Number(item.price) * Number(item.quantity);
    }, 0);

    return {
        items,
        total
    };
}



async function displayCollections(collections) {

    let html = "";

    for (const collection of collections) {

        const products = await ProductModel.getProductsByCollection(
            pool,
            collection
        );


        html += `
            <section class="collection-section">

                <div class="collection-header">

                    <h1 class="title1">
                        ${collection.name}
                    </h1>

                    <div class="collection-actions">

                        <a href="/collection/${collection.slug}" class="read-more">
                            Read more
                        </a>

                        <button class="carousel-btn prev" data-target="${collection.tag}">
                            &#10094;
                        </button>

                        <button class="carousel-btn next" data-target="${collection.tag}">
                            &#10095;
                        </button>

                    </div>

                </div>


                <div class="product-carousel" id="${collection.tag}">

                    <div class="product-track">

                        ${products.length > 0
                ? createProductCard(products)
                : "<p>Aucun produit disponible.</p>"
            }

                    </div>

                </div>

            </section>
        `;
    }


    return html;
}

async function displayProductOptions(product) {

    if (!product || !product.options) {
        return "";
    }

    // Ex: "Pointure:40|41|42|43;Couleur:Noir|Blanc"
    const optionTypes = product.options.split(";");

    let html = "";

    optionTypes.forEach((type) => {

        // On sépare "Pointure" de "40|41|42|43"
        const [groupNameRaw, valuesRaw] = type.split(":");

        if (!groupNameRaw || !valuesRaw) return; // groupe mal formé, on ignore

        const groupName = groupNameRaw.trim();
        const options = valuesRaw.split("|");

        html += `<div class="option-div" data-group="${groupName}">`;
        html += `<h5 class="option-group-title">${groupName}</h5>`;
        html += `<div class="option-items">`;

        options.forEach(option => {
            html += `
                <div class="option-item" data-option="${option.trim()}">
                    ${option.trim()}
                </div>
            `;
        });

        html += `</div></div>`;
    });

    return html;
}

async function displayCollectionShowcase(tag) {

    try {

        const rows = await pool.query(
            `
            SELECT *
            FROM collections
            WHERE FIND_IN_SET(?, tag)
            ORDER BY display_home DESC
            LIMIT 4
            `,
            [tag]
        );


        if (!rows || rows.length === 0) {
            return "";
        }

        const title = tag.charAt(0).toUpperCase() + tag.slice(1);


        let html = `

            <section class="showcase-section">

                <h2 class="title2">
                    ${title}
                </h2>


                <div class="collection-showcase">

        `;


        rows.forEach(collection => {

            html += `

            <a style="text-decoration: none;" href="http://localhost:5000/collection/${collection.slug}">
                <div class="collection" data-id="${collection.id}">

                    <div 
                        class="collection-img"
                        style="
                            background-image:url('${collection.img_url}')
                        "
                    ></div>


                    <h2 class="showcase-name">
                        ${collection.name}
                    </h2>

                </div>
            
            </a>

            `;

        });


        html += `

                </div>

            </section>

        `;


        return html;


    } catch (error) {

        console.error(
            "Erreur lors de l'affichage du showcase :",
            error
        );

        return "";

    }

}

async function displayCollectionSelection(tag) {

    try {

        const rows = await pool.query(
            `
            SELECT *
            FROM collections
            WHERE FIND_IN_SET(?, tag)
            ORDER BY display_home DESC
            LIMIT 3
            `,
            [tag]
        );

        if (!rows || rows.length === 0) {
            return "";
        }

        const title = tag.charAt(0).toUpperCase() + tag.slice(1);

        let html = `
            <section class="collection-selection">

                <h2 class="title2">${title}</h2>

                <div class="selection-grid">
        `;

        rows.forEach((collection, index) => {

            html += `
                <div class="selection-item" ${index === 0 ? 'id="d"' : ''} data-id="${collection.id}">

                    <div
                        class="selection-img"
                        style="background-image: url('${collection.img_url}')"
                    >

                        <h3 class="selection-name">
                            ${collection.name}
                        </h3>

                        <strong>
                            <a href="/collection/${collection.slug}" class="details-link">
                                View Details
                            </a>
                        </strong>

                    </div>

                </div>
            `;

        });

        html += `
                </div>

            </section>
        `;

        return html;

    } catch (error) {

        console.error(
            "Erreur lors de l'affichage des collections :",
            error
        );

        return "";
    }

}

async function renderCollectionProducts(pool, collection) {

    try {
        // Récupère les produits de la collection depuis la BDD
        const products = await ProductModel.getProductsByCollection(pool, collection);

        if (!products || products.length === 0) {
            return "<p>Aucun produit trouvé pour cette collection.</p>";
        }

        // Génère les cartes produits à partir des résultats
        const html = createProductCard(products);

        return html;

    } catch (error) {
        console.error("Erreur lors du rendu de la collection :", error);
        return "<p>Une erreur est survenue lors du chargement des produits.</p>";
    }
}

async function makeResearch(pool, word) {

    try {

        const rows = await pool.query(
            `
            SELECT *
            FROM products
            WHERE
                name LIKE ?
                OR slug LIKE ?
                OR FIND_IN_SET(?, category)
                OR category LIKE ?
            ORDER BY name ASC
            `,
            [
                `%${word}%`,
                `%${word}%`,
                word,
                `%${word}%`
            ]
        );

        return rows;

    } catch (error) {

        console.error(
            "Erreur SQL lors de la recherche des produits :",
            error
        );

        throw error;

    }

}


module.exports = {
    displayProductOptions,
    displayCollections,
    displayCollectionShowcase,
    displayCollectionSelection,
    renderCollectionProducts,
    makeResearch,
    createProductCard,
    prepareCheckoutCart
};
