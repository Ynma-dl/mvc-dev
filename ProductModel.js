class ProductModel {
    constructor(dbPool) {
        this.pool = dbPool;
    }

    async getById(id) {
        let conn;
        try {
            conn = await this.pool.getConnection();
            const rows = await conn.query("SELECT * FROM products WHERE id = ?", [id]);
            return rows.length > 0 ? rows[0] : null; 
            
        } catch (error) {
            console.error("Erreur SQL lors de la récupération du produit :", error);
            throw error;
        } finally {
            if (conn) conn.release();
        }
    }
}

module.exports = ProductModel;