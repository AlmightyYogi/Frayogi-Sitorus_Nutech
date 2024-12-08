const db = require('../config/db');

const Service = {
    getAll: async () => {
        const [rows] = await db.promise().query('SELECT * FROM services');
        return rows;
    },

    getServiceByCode: (serviceCode, callback) => {
        const query = 'SELECT * FROM services WHERE service_code = ?';
        db.query(query, [serviceCode], callback);
      }
};

module.exports = Service;
