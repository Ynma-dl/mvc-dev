class CollectionModel {
    constructor(dbPool) {
        this.pool = dbPool;
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

            return rows[0];

        } catch (error) {

            console.error(
                "Erreur SQL lors de la récupération des collections :",
                error
            );

            throw error;
        }
    
    }
}

module.exports = CollectionModel;