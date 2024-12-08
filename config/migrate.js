const pool = require('./db')

const createTables = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            first_name VARCHAR(255) NOT NULL,
            last_name VARCHAR(255) NOT NULL,
            password VARCHAR(20) NOT NULL,
            profile_image VARCHAR(255)
            );
        `);
        console.log('users table created');
    } catch (error) {
        console.log('error: ', error.message);
    }
};

const migration = async () => {
    await createTables();
};