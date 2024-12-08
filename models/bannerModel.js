const db = require('../config/db');

const Banner = {
    getAll: async () => {
        const [rows] = await db.promise().query('SELECT * FROM banners');
        return rows;
    },
};

module.exports = Banner;
