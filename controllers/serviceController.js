const db = require('../config/db');

const getAllServices = async (req, res) => {
    try {
        const [services] = await db.query("SELECT * FROM services");
        res.status(200).json({
            status: 0,
            message: 'Sukses',
            data: services,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Server Error',
            data: null,
        });
    }
};

const getServiceByCode = async (req, res) => {
    const { serviceCode } = req.params;
    try {
        const [service] = await db.query("SELECT * FROM services WHERE service_code = ?", [serviceCode]);
        if (!service.length) {
            return res.status(404).json({
                status: 404,
                message: 'Service not found',
                data: null,
            });
        }
        res.status(200).json({
            status: 0,
            message: 'Sukses',
            data: service[0],
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Server Error',
            data: null,
        });
    }
};

module.exports = { getAllServices, getServiceByCode };
