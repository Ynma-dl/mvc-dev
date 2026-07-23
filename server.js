const express = require('express');
const session = require("express-session");
const productRoutes = require("./routes/product_route.js");
const path = require('path');
const pool = require('./database/db.js');
const ProductModel = require('./models/ProductModel.js');
const { displayCollections } = require("./utils/function.js");
const { displayCollectionShowcase } = require("./utils/function.js");
const { displayCollectionSelection } = require("./utils/function.js");
const PORT = 5000;
const app = express();
const cartRoutes = require('./routes/cart_route.js');
const collectionRoutes = require('./routes/collection_route.js');
const searchRoutes = require('./routes/research_route.js');
const checkoutRoutes = require('./routes/checkout_route.js');
const productModel = new ProductModel(pool);
const adminRoutes = require("./routes/admin_route.js");
const productAdminRoutes = require("./routes/admin_product_route.js");
const collectionAdminRoutes = require("./routes/admin_collection_route.js");
const methodOverride = require("method-override");

// Permet de servir CSS, images, JS

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(session({
    secret: "ma-cle-secrete",
    resave: false,
    saveUninitialized: true
}));

// Initialise le panier s'il n'existe pas encore
app.use((req, res, next) => {
    if (!req.session.cart) {
        req.session.cart = [];
    }
    next();
});

// Rend le panier disponible dans TOUTES les vues EJS (compteur, etc.)
app.use((req, res, next) => {
    res.locals.cart = req.session.cart;
    next();
});


app.use(methodOverride("_method"));

app.use("/product", productRoutes);
app.use('/cart', cartRoutes);
app.use('/collection', collectionRoutes)
app.use('/', searchRoutes);
app.use('/', checkoutRoutes);
app.use('/', adminRoutes);
app.use("/", productAdminRoutes);
app.use("/", collectionAdminRoutes);

console.log(process.env.DB_HOST);
console.log(process.env.DB_PORT);
console.log(process.env.DB_NAME);

// Configuration EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.get("/", async (req, res) => {

    const showCase = await displayCollectionShowcase("été");

    const collections = await ProductModel.getAllCollections(pool);

    const gridSelection = await displayCollectionSelection("streetwear");

    const homeCollections = collections.filter(
        collection => collection.display_home === 1
    );

    const html = await displayCollections(homeCollections);

    res.render("index", {
        collections,
        html,
        showCase,
        gridSelection
    });
});


app.listen(PORT, "0.0.0.0", () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});