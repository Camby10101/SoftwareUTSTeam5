// db.js

// Import the mysql2 library
const mysql = require('mysql2');

// Create a connection to the database
const connection = mysql.createConnection({
  host: 'localhost',   // Your MySQL host (use '127.0.0.1' or 'localhost')
  user: 'root',        // Your MySQL username
  password: '',  // Your MySQL password
  //database: 'iot'      // The database you want to connect to
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL database as id ' + connection.threadId);
});

// Create 'iot' database if it doesn't exist
connection.query('CREATE DATABASE IF NOT EXISTS iot', (err) => {
  if (err) throw err;
  console.log('✅ Database "iot" ready');

  // Switch to 'iot' database
  connection.changeUser({ database: 'iot' }, (err) => {
    if (err) throw err;

    // Create 'products' table if it doesn't exist
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) UNIQUE,
        description TEXT,
        price DECIMAL(10, 2),
        image VARCHAR(255),
        stock INT DEFAULT 0
      )
    `;
    connection.query(createTableQuery, (err) => {
      if (err) throw err;
      console.log('✅ Products table ready');


      // Check if products exist
      connection.query('SELECT COUNT(*) AS count FROM products', (err, results) => {
        if (err) throw err;

        const count = results[0].count;
        if (count === 0) {
          // Insert default products
          const insertProducts = `
            REPLACE INTO products (name, description, price, image, stock)
            VALUES
            ('IoT Temperature Sensor', 'Wireless temperature and humidity sensor', 49.99, 'images/temp-sensor.png', 100),
            ('Smart Light Bulb', 'Wi-Fi enabled smart bulb', 29.99, 'images/bulb.png', 200),
            ('IoT Gateway Hub', 'Central hub for all IoT devices', 99.99, 'images/gateway-hub.png', 75),
            ('Motion Detector', 'Infrared motion detector for home automation', 39.99, 'images/motion-detector.png', 120),
            ('Smart Plug', 'Control appliances remotely', 19.99, 'images/smart-plug.png', 300)
          `;
          connection.query(insertProducts, (err) => {
            if (err) throw err;
            console.log('✅ Sample products inserted');
          });
        } else {
          console.log(`${count} product(s) already exist. No need to insert sample data.`);
        }
      });
    });
  });
  const createPaymentsTable = `
      CREATE TABLE IF NOT EXISTS payments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        cardholderName VARCHAR(100),
        cardType VARCHAR(50),
        cardNumber VARCHAR(20),
        pin VARCHAR(10),
        expiry DATE,
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    connection.query(createPaymentsTable, (err) => {
      if (err) throw err;
      console.log('✅ Payments table ready');
    });
});


// Export the connection to be used in other files
module.exports = connection;
