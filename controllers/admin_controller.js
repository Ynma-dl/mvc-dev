const pool = require("../database/db");
const { renderProductViews, renderOrderViews } = require("../utils/function");
const collectionModel = require("../models/collectionModel");
const dashboardModel = require("../models/dashboardModel.js");
const ordersModels = require("../models/ordersModel.js");
const path = require("path");
const CONSTANTS = require("../utils/config");



// Page dashboard

exports.dashboard = async (req, res) => {

    try {

        const collectionName = await collectionModel.getCollectionBySlug(pool, "sneakers");

        const collection = await collectionModel.getProductsByCollection(
            pool,
            collectionName
        );

        const productHtml = renderProductViews(collection);

        const ordersHtml = await renderOrderViews(pool);


        res.render("admin/dashboard", {
            title: "Dashboard",
            productHtml,
            ordersHtml
        });


    } catch (error) {

        console.log("Erreur dashboard :", error);

        res.status(500).send("Erreur serveur");
    }

};



// API statistiques

exports.getStats = async (req, res) => {

    try {

        const ordersRows =
            await dashboardModel.getOrdersByHour(pool);


        const salesRows =
            await dashboardModel.getSalesPerHour(pool);

        const sales = await dashboardModel.getDailySales(pool);

        res.json({

            updatedAt: new Date(),

            orders:
                dashboardModel.formatHourlyData(ordersRows),

            hoursSales:
                dashboardModel.formatHourlyData(salesRows),

            dailySales: sales

        });


    } catch (error) {

        console.log("Erreur dashboard :", error);


        res.status(500).json({
            error: "Erreur serveur"
        });

    }

};



// Catalogue

exports.catalogue = async (req, res) => {

    res.render("admin/catalogue", {
        title: "Catalogue"
    });

};



// orders

exports.getOrderDetails = async (req, res) => {


    const id = req.params.id;


    console.log("ID reçu :", id);


    const order = await ordersModels.getById(pool, id);


    console.log(order);


    res.json(order);


}

exports.orders = async (req, res) => {

    const ordersHtml = await ordersModels.renderOrderViews(pool);

    res.render("admin/orders", {
        title: "orders",
        orders: ordersHtml,
    });
};

exports.updateOrderStatus = async (req, res) => {
    const id = req.params.id;
    const { status } = req.body;

    const allowedStatuses = ['pending', 'confirmed', 'delivered', 'cancelled'];
    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ error: 'Statut invalide' });
    }

    try {
        await ordersModels.updateStatus(pool, id, status);
        res.json({ success: true, status });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};



// Paramètres

exports.settings = async (req, res) => {

    res.render("admin/settings", {
        title: "Paramètres"
    });

};