// routes/search.js
const express = require('express');
const router = express.Router();
const searchController = require('../controllers/research_controller');

router.get('/search', searchController.showSearchResults);

module.exports = router;