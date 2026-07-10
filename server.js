
const express = require('express');
const path = require('path');
const pool = require('./database/db.js'); 
const ProductModel = require('./ProductModel');
const PORT = 5000;
const app = express(); 

const productModel = new ProductModel(pool);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'index.html'));
});

app.get('/api/produit/:id', async (req, res) => {
    const produitId = req.params.id;

    try {
        const produit = await productModel.getById(produitId);
        
        if (produit) {
            res.json(produit);
        } else {
            res.status(404).json({ error: "Produit non trouvé" }); 
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});


app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});