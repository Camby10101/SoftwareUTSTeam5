const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const port = 3000;

// Middleware to parse incoming JSON requests
app.use(express.json());

// MySQL Database Setup
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',           // Your MySQL username
  password: 'Balllife45', // Your MySQL password
  database: 'iot'         // Database name
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL database');
});

// Registration endpoint
app.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  // Log incoming data to check
  console.log('Received data:', req.body);

  // Check if all fields are provided
  if (!username || !email || !password) {
    return res.json({ success: false, message: 'All fields are required!' });
  }

  // SQL query to insert user into the database
  const query = 'INSERT INTO customers (username, email, password) VALUES (?, ?, ?)';

  // Execute the query to insert user into the database
  connection.execute(query, [username, email, password], (err, results) => {
    if (err) {
      console.error('Error inserting user data: ' + err.stack);
      return res.json({ success: false, message: 'Failed to register user!' });
    }

    // Respond with success message
    res.json({ success: true, message: 'User registered successfully!' });
  });
});

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Serve the index page for the home route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});




