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

router.get(
    "/admin-complique/orders/:id",
    adminController.getOrderDetails
);

// routes.js
router.patch('/admin-complique/orders/:id/status', adminController.updateOrderStatus);

// Paramètres
router.get(
    "/admin-complique/settings",
    adminController.settings
);


module.exports = router;