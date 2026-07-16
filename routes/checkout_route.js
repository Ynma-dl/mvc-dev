const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkout_controller');

router.get('/checkout', checkoutController.getCheckout);

module.exports = router;