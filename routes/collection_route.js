const express = require("express");
const router = express.Router();

const CollectionController = require("../controllers/collection_controller.js");

router.get("/:slug", CollectionController.show);

module.exports = router;