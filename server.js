const express = require('express');
const path = require('path');
const pool = require('./database/db.js'); 
const PORT = 5000
const app = express();

async function initDatabase() {
    let conn;
    try {
        conn = await pool.getConnection();
        
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                colors VARCHAR(255),
                stock INT DEFAULT 0
            );
        `;
        
        await conn.query(createTableQuery);
        console.log("Table 'products' prête et vérifiée !");
    } catch (err) {
        console.error(" Erreur lors de la création de la table :", err);
    } finally {
        if (conn) conn.release();
    }
}

initDatabase();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'index.html'));
});


app.get('/api/produit/:id', async (req, res) => {
    const produitId = req.params.id;
    let conn;

    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM products WHERE id = ?", [produitId]);
        
        if (rows.length > 0) {
            res.json(rows[0]); 
        } else {
            res.status(404).json({ error: "Produit non trouvé" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    } finally {
        if (conn) conn.release();
    }
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
