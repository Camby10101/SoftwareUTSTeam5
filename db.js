// db.js

const mysql = require('mysql2');

// Create a connection to the database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'iot'
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
  console.log('Database "iot" ready');

  // Switch to 'iot' database
  connection.changeUser({ database: 'iot' }, (err) => {
    if (err) throw err;





    const createCustomersTable = `
  CREATE TABLE IF NOT EXISTS customers (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    fullname VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    password VARCHAR(100)
  )
`;
    connection.query(createCustomersTable, (err) => {
      if (err) throw err;
      console.log('Customers table ready');
    });

    connection.query('SELECT COUNT(*) AS count FROM customers', (err, results) => {
      if (err) throw err;

      const count = results[0].count;
      if (count === 0) {
        const insertUsers = `
      INSERT INTO customers (fullname, email, phone, password)
      VALUES 
        ('Alice Johnson', 'alice@example.com', '1234567890', 'password123'),
        ('Bob Smith', 'bob@example.com', '0987654321', 'mypassword'),
        ('Charlie Brown', 'charlie@example.com', '5551234567', 'charlie123'),
        ('test', 'test@example.com', '111111111', 'password'),
        ('me', 'me@example.com', '222222222', '123')
    `;
        connection.query(insertUsers, (err) => {
          if (err) throw err;
          console.log('Sample customers inserted');
        });
      } else {
        console.log(`${count} customers already exist.`);
      }
    });


    const createAccessLogTable = `
  CREATE TABLE IF NOT EXISTS accesslog (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    login_time DATETIME,
    logout_time DATETIME,
    FOREIGN KEY (user_id) REFERENCES customers(user_id)
  )
`;
    connection.query(createAccessLogTable, (err) => {
      if (err) throw err;
      console.log('AccessLog table ready');
    });



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
      console.log('Products table ready');


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
            ('Smart Plug', 'Control appliances remotely', 19.99, 'images/smart-plug.png', 300),
            ('Smart Fridge', 'Put your food in it', 399.99, 'images/fridge.png', 20),
            ('Smart Watch', 'Great for fitness tracking', 77.00, 'images/watch.png', 40),
            ('Amazon Echo', 'Smart speakers', 100, 'images/echo.png', 0),
            ('Dash Cam', 'Capture detailed video', 429.00, 'images/dash.png', 60),
            ('Google Nest Hub', 'Manage your smart home', 125.00, 'images/hub.png', 35),
            ('Mini Drone', 'The most advanced mini-camera drone to date', 949.00, 'images/drone.png', 10),
            ('Modem Router', 'Connect wirelessly to networks', 49.99, 'images/router.png', 150),
            ('4K LED TV', 'Vibrant pictures', 300.00, 'images/tv.png', 200),
            ('Air Quality Monitor', 'Control indoor pollution', 320.94, 'images/qual.png', 350),
            ('Smart Door Lock', 'Protect your home', 579.99, 'images/lock.png', 100),
            ('Universal Remote', 'One remote for everything', 25.89, 'images/remote.png', 50),
            ('Desktop Motherboard', 'PC part', 359.00, 'images/motherboard.png', 250),
            ('Camera', 'Capture photos', 999.00, 'images/camera.png', 70),
            ('Air Purifier', 'Compact air purifier', 199.00, 'images/purifier.png', 50),
            ('Smart Thermostat', 'Display temperatures in your house', 299.99, 'images/thermo.png', 90)
          `;
          connection.query(insertProducts, (err) => {
            if (err) throw err;
            console.log('Sample products inserted');
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
    console.log('Payments table ready');
  });
  const createOrdersTable = `
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id VARCHAR(100) UNIQUE,
        email VARCHAR(100),
        status ENUM('saved', 'submitted', 'cancelled') DEFAULT 'saved',
        cart JSON,
        total DECIMAL(10, 2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
  `;
  connection.query(createOrdersTable, (err) => {
    if (err) throw err;
    console.log('Orders table ready');
  });
});


// Export the connection to be used in other files
module.exports = connection;
