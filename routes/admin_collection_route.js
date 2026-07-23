const express = require("express");
const router = express.Router();

const collectionController = require("../controllers/admin_collection_controller");


// Afficher toutes les collections
router.get(
    "/admin-complique/catalogue/collections",
    collectionController.index
);


// Afficher le formulaire de création
router.get(
    "/admin-complique/catalogue/collections/create",
    collectionController.create
);


// Enregistrer une nouvelle collection
router.post(
    "/admin-complique/catalogue/collections",
    collectionController.store
);


// Afficher le formulaire de modification
router.get(
    "/admin-complique/catalogue/collections/:id/edit",
    collectionController.edit
);


// Mettre à jour une collection
router.put(
    "/admin-complique/catalogue/collections/:id",
    collectionController.update
);


// Supprimer une collection
router.delete(
    "/admin-complique/catalogue/collections/:id",
    collectionController.delete
);



module.exports = router;