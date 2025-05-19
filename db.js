// db.js

// Import the mysql2 library
const mysql = require('mysql2');

// Create a connection to the database
const connection = mysql.createConnection({
  host: 'localhost',   // Your MySQL host (use '127.0.0.1' or 'localhost')
  user: 'root',        // Your MySQL username
  password: '',  // Your MySQL password
  database: 'iot'      // The database you want to connect to
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL database as id ' + connection.threadId);
});

// Export the connection to be used in other files
module.exports = connection;
