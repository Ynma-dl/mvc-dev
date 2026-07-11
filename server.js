const express = require('express');
const session = require("express-session");
const productRoutes = require("./routes/product_route.js");
const path = require('path');
const pool = require('./database/db.js');
const ProductModel = require('./models/ProductModel.js');
const displayCollections = require("./utils/function.js");
const PORT = 5000;
const app = express();

const productModel = new ProductModel(pool);


// Permet de servir CSS, images, JS

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: "ma-cle-secrete",
    resave: false,
    saveUninitialized: true
}));

app.use("/product", productRoutes);

console.log(process.env.DB_HOST);
console.log(process.env.DB_PORT);
console.log(process.env.DB_NAME);

// Configuration EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.get("/", async (req, res) => {
    const collections = await ProductModel.getAllCollections(pool);
    const html = await displayCollections(collections, 3);
    res.render("index", {
        collections,
        html
    });
});


app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});