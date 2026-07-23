const pool = require("../database/db");



// Afficher tous les produits

exports.index = async (req,res)=>{


    res.render(
        "admin/products/index"
    );


};



// Formulaire création

exports.create = async(req,res)=>{


    res.render(
        "admin/products/create"
    );


};



// Sauvegarder produit

exports.store = async(req,res)=>{


    // insertion SQL ici


    res.redirect(
        "/admin-complique/catalogue/products"
    );


};



// Formulaire modification

exports.edit = async(req,res)=>{


    const id = req.params.id;


    res.render(
        "admin/products/edit",
        {
            id
        }
    );


};



// Modifier

exports.update = async(req,res)=>{


    // update SQL


    res.redirect(
        "/admin-complique/catalogue/products"
    );


};



// Supprimer

exports.delete = async(req,res)=>{


    // delete SQL


    res.redirect(
        "/admin-complique/catalogue/products"
    );


};