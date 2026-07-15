const express = require("express");
const router = express.Router();

const ProductController = require("../controllers/product_controller.js");

router.get("/:slug", ProductController.show);

module.exports = router;