const pool = require('./db');

const createTables = async () => {
    try {
        // Create users table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                first_name VARCHAR(255) NOT NULL,
                last_name VARCHAR(255) NOT NULL,
                password VARCHAR(255) NOT NULL,
                profile_image VARCHAR(255)
            );
        `);

        // Create transactions table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS transactions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                service_code VARCHAR(255) NOT NULL,
                transaction_type VARCHAR(255),
                description VARCHAR(255),
                total_amount DECIMAL(10, 2),
                invoice_number VARCHAR(255),
                created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );
        `);

        // Create services table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS services (
                id INT AUTO_INCREMENT PRIMARY KEY,
                service_code VARCHAR(50) NOT NULL,
                service_name VARCHAR(255) NOT NULL,
                service_icon VARCHAR(255) NOT NULL,
                service_tariff INT NOT NULL
            );
        `);

        // Create banners table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS banners (
                id INT AUTO_INCREMENT PRIMARY KEY,
                banner_name VARCHAR(255) NOT NULL,
                banner_image VARCHAR(255) NOT NULL,
                description TEXT
            );
        `);

        // Create balances table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS balances (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                balance DECIMAL(10, 2) DEFAULT 0.00,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            );
        `);

        console.log('Tables created successfully');
    } catch (error) {
        console.log('Error: ', error.message);
    }
};

const migration = async () => {
    await createTables();
};

module.exports = migration;
