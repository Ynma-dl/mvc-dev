const express = require("express");
const router = express.Router();

const productController = require("../controllers/admin_product_controller");



// Liste des produits

router.get(
    "/admin-complique/catalogue/products",
    productController.index
);



// Page création

router.get(
    "/admin-complique/catalogue/products/create",
    productController.create
);



// Enregistrer produit

router.post(
    "/admin-complique/catalogue/products",
    productController.store
);



// Page modification

router.get(
    "/admin-complique/catalogue/products/:id/edit",
    productController.edit
);



// Mise à jour

router.put(
    "/admin-complique/catalogue/products/:id",
    productController.update
);



// Suppression

router.delete(
    "/admin-complique/catalogue/products/:id",
    productController.delete
);



module.exports = router;