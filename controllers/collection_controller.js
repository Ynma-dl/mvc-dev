const collectionModel = require("../models/collectionModel");
const pool = require("../database/db");
const { renderCollectionProducts } = require("../utils/function")


exports.show = async (req, res) => {

    const slug = req.params.slug;
$
    const collection = await collectionModel.getCollectionBySlug(
        pool,
        slug
    );

    const productsHtml = await renderCollectionProducts(pool, collection);

    console.log(collection);
    res.render("collection", {
        collection,
        productsHtml


    });
};