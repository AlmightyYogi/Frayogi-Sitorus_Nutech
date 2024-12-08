const db = require('../config/db');

const getAllBanners = async (req, res) => {
    try {
        const [banners] = await db.query('SELECT * FROM banners');
        res.status(200).json({
            status: 0,
            message: 'Sukses',
            data: banners,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Server Error',
            data: null,
        });
    }
};

module.exports = { getAllBanners };