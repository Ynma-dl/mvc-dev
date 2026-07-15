const { research } = require("../utils/function");
const pool = require("../database/db");


// controllers/searchController.js

exports.showSearchResults = async (req, res) => {
  try {
    // Récupère la variable "q" dans l'URL : /search?q=chaussures
    const query = req.query.q || '';

    if (!query.trim()) {
      return res.render('research', {
        query: '',
        results: [],
        message: 'Veuillez entrer un terme de recherche.'
      });
    }

    // Exemple avec ta base de données (adapte selon ton modèle/PDO wrapper etc.)
    // const results = await Product.search(query);

    const results = await research.makeResearch(pool, query); // <-- remplace par ta vraie recherche en BDD

    console.log(results)

    res.render('research', {
      query,
      results,
      message: results.length === 0 ? 'Aucun résultat trouvé.' : null
    });

  } catch (err) {
    console.error('Erreur lors de la recherche :', err);
    res.status(500).send('Erreur serveur');
  }
};