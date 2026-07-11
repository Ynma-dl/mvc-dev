const ProductModel = require("../models/ProductModel");
const pool = require("../database/db");


exports.show = async (req, res) => {

    const id = req.params.id;

    const product = await ProductModel.getProductById(
        pool,
        id
    );

    res.render("product", {
        product
    });
};