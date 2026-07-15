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

    static async getProductBySlug(pool, slug){

    const rows = await pool.query(
        `
        SELECT *
        FROM products
        WHERE slug = ?
        `,
        [slug]
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
                `
                SELECT *
                FROM collections
                ORDER BY display_home DESC
                `
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

    static async getCollectionBySlug(pool, slug) {
        
        try {

            const rows = await pool.query(
                `
                SELECT *
                FROM collections
                WHERE slug=?
                `,
                [slug]
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
                `
                SELECT *
                FROM products
                WHERE FIND_IN_SET(?, REPLACE(category, ' ', ''))
                OR FIND_IN_SET(?, REPLACE(category, ' ', ''))
                `,
                [
                    collection.tag,
                    collection.name
                ]
            );

            return rows;


        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

module.exports = ProductModel;