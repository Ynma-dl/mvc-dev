const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin_controller");


// Dashboard
router.get(
    "/admin-complique",
    adminController.dashboard
);

router.get(
    "/admin-complique/stats",
    adminController.getStats
);

// Catalogue (page d'accueil catalogue)
router.get(
    "/admin-complique/catalogue",
    adminController.catalogue
);

router.get(
    "/admin-complique/orders",
    adminController.orders
)

// Paramètres
router.get(
    "/admin-complique/settings",
    adminController.settings
);


module.exports = router;