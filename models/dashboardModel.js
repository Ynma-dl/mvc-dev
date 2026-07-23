async function getOrdersByHour(pool) {

    const today = new Date()
        .toISOString()
        .slice(0, 10);


    const rows = await pool.query(
        `
SELECT 
    HOUR(created_at) AS hour,
    COUNT(*) AS total

FROM orders

WHERE created_at >= ?
AND created_at < DATE_ADD(?, INTERVAL 1 DAY)

GROUP BY HOUR(created_at)

ORDER BY hour ASC
`,
        [
            today + " 00:00:00",
            today + " 00:00:00"
        ]
    );


    return rows;

}

function formatHourlyData(rows) {
    const data = Array(24).fill(0);

    rows.forEach(row => {
        data[Number(row.hour)] = Number(row.total);
    });

    return data;
}

async function getSalesPerHour(pool) {

    const today = new Date()
        .toISOString()
        .slice(0, 10);

    const rows = await pool.query(
        `
        SELECT
            HOUR(created_at) AS hour,
            SUM(total) AS total
        FROM orders
        WHERE created_at >= ?
          AND created_at < DATE_ADD(?, INTERVAL 1 DAY)
        GROUP BY HOUR(created_at)
        ORDER BY hour ASC
        `,
        [
            today + " 00:00:00",
            today + " 00:00:00"
        ]
    );

    return rows;
}

async function getDailySales(pool) {

    const today = new Date()
        .toISOString()
        .slice(0, 10);


    const rows = await pool.query(

        `
SELECT 
SUM(total) AS sales

FROM orders

WHERE created_at >= ?
AND created_at < DATE_ADD(?, INTERVAL 1 DAY)

`,
        [
            today + " 00:00:00",
            today + " 00:00:00"
        ]

    );


    return rows[0].sales || 0;


}


module.exports = {
    getDailySales,
    getOrdersByHour,
    formatHourlyData,
    getSalesPerHour

}