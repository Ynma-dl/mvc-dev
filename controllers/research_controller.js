const { makeResearch } = require("../utils/function");
const { createProductCard } = require("../utils/function");
const pool = require("../database/db");
// controllers/searchController.js
 exports.showSearchResults = async (req, res) => {
  try {
    const query = req.query.q || '';

    if (!query.trim()) {
      return res.render('research', {
        query: '',
        results: [],
        totalResults: 0, // <-- On initialise à 0 s'il n'y a pas de recherche
        message: 'Veuillez entrer un terme de recherche.',
        productsHtml: ''
      });
    }

    const results = await makeResearch(pool, query); 
    const productsHtml = createProductCard(results);

    res.render('research', {
      query,
      results,
      totalResults: results.length, // <-- On envoie le nombre réel de résultats ici !
      message: results.length === 0 ? 'Aucun résultat trouvé.' : null,
      productsHtml
    });

  } catch (err) {
    console.error('Erreur lors de la recherche :', err);
    res.status(500).send('Erreur serveur');
  }
};