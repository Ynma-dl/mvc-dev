const ProductModel = require("../models/ProductModel");
const pool = require("../database/db");
const { displayProductOptions } = require("../utils/function");


exports.show = async (req, res) => {

    const id = req.params.id;

    const product = await ProductModel.getProductById(
        pool,
        id
    );

    const optionsHTML = await displayProductOptions(product);

    console.log(optionsHTML);

    res.render("product", {
        product,
        optionsHTML
    });
};