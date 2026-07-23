const pool = require("../database/db");


// Afficher toutes les collections

exports.index = async (req, res) => {

    try {


        // Plus tard :
        // const collections = await collectionModel.getAll(pool);


        res.render("admin/collections/index", {

            title: "Collections"

        });


    } catch (error) {

        console.log(error);

        res.status(500).send("Erreur serveur");

    }

};




// Afficher le formulaire de création

exports.create = async (req, res) => {


    res.render("admin/collections/create", {

        title: "Créer une collection"

    });


};





// Enregistrer une collection

exports.store = async (req, res) => {

    try {


        /*
            Exemple des données reçues :

            {
                name,
                description,
                image_url,
                slug
            }

        */


        // insertion SQL ici


        res.redirect(
            "/admin-complique/catalogue/collections"
        );


    } catch(error) {

        console.log(error);

        res.status(500).send("Erreur serveur");

    }

};





// Afficher modification

exports.edit = async (req, res) => {


    try {


        const id = req.params.id;


        // récupérer collection par ID ici


        res.render("admin/collections/edit", {

            title: "Modifier collection",

            id

        });


    } catch(error) {

        console.log(error);

        res.status(500).send("Erreur serveur");

    }

};





// Modifier une collection

exports.update = async (req, res) => {


    try {


        const id = req.params.id;


        /*
            update SQL ici

        */


        res.redirect(
            "/admin-complique/catalogue/collections"
        );


    } catch(error) {


        console.log(error);

        res.status(500).send("Erreur serveur");


    }

};





// Supprimer une collection

exports.delete = async (req, res) => {


    try {


        const id = req.params.id;


        /*
            delete SQL ici

        */


        res.redirect(
            "/admin-complique/catalogue/collections"
        );


    } catch(error) {


        console.log(error);

        res.status(500).send("Erreur serveur");


    }

};