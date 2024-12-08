const Service = require('../models/serviceModel');

const getAllServices = async (req, res) => {
    try {
        const services = await Service.getAll();
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

module.exports = { getAllServices };
