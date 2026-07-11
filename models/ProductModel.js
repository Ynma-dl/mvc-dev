class ProductModel {
    constructor(dbPool) {
        this.pool = dbPool;
    }

    static async getProductById(pool, id){

    const rows = await pool.query(
        `
        SELECT *
        FROM products
        WHERE id = ?
        `,
        [id]
    );

    return rows[0];
    }

    static async getAllProducts(pool) {
        try {
            const rows = await pool.query(
                "SELECT * FROM products"
            );

            return rows;

        } catch (error) {
            console.error(
                "Erreur SQL lors de la récupération des produits :",
                error
            );

            throw error;
        }
    }

    static async getAllCollections(pool) {

        try {
            const rows = await pool.query(
                "SELECT DISTINCT category FROM products"
            );

            return rows;

        } catch (error) {
            console.error(
                "Erreur SQL lors de la récupération des collections :",
                error
            );

            throw error;
        }
    }

    static async getProductsByCollection(pool, collection) {

        try {
            const rows = await pool.query(
                "SELECT * FROM products WHERE category = ?",
                [collection]
            );

            return rows;

        } catch (error) {
            console.error(
                "Erreur SQL lors de la récupération des produits par collection :",
                error
            );

            throw error;
        }
    }
}

module.exports = ProductModel;