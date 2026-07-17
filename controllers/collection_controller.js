const collectionModel = require("../models/collectionModel");
const pool = require("../database/db");
const { renderCollectionProducts } = require("../utils/function")


exports.show = async (req, res) => {

    const slug = req.params.slug;

    const collection = await collectionModel.getCollectionBySlug(
        pool,
        slug
    );

    const allProduct = await collectionModel.getProductsByCollection(pool, collection);
    let totalResults = 0;

    allProduct.forEach(name => {
        totalResults += 1;
    });

    const productsHtml = await renderCollectionProducts(pool, collection);
    
    res.render("collection", {
        collection,
        productsHtml,
        totalResults


    });
};