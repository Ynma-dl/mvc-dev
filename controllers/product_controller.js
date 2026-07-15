const ProductModel = require("../models/ProductModel");
const pool = require("../database/db");
const { displayProductOptions } = require("../utils/function");


exports.show = async (req, res) => {

    const slug = req.params.slug;

    const product = await ProductModel.getProductBySlug(
        pool,
        slug
    );

    const product_imgs = product.images_url.split(",");

    const optionsHTML = await displayProductOptions(product);

    console.log(product);

    res.render("product", {
        product,
        product_imgs,
        optionsHTML
    });
};