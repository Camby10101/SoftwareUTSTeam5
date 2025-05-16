const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const mysql = require('mysql2');
const path = require('path');
const multer = require('multer'); // For handling file uploads
const app = express();
const port = 3000;
const PORT = process.env.PORT || 3000;

let orderHistory = [];

// Middleware to parse incoming JSON requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

// MySQL Database Setup
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',           // Your MySQL username
  password: '', // Your MySQL password
  database: 'iot'         // Database name
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL database');
});

// Multer setup for storing images in a folder called "uploads"
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Store files in the "uploads" directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Use timestamp to avoid name collisions
  }
});

const upload = multer({ storage: storage });

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

// Endpoint to add a product (with an image upload)
app.post('/addProduct', upload.single('image'), (req, res) => {
  const { name, description, price } = req.body;
  const imagePath = req.file ? req.file.path : null; // Store the image file path

  console.log('Received product data:', req.body);
  console.log('Received image file:', req.file);

  // Validate input
  if (!name || !description || !price) {
    return res.json({ success: false, message: 'All fields are required!' });
  }

  // SQL query to insert product into the database
  const query = 'INSERT INTO products (name, image, description, price) VALUES (?, ?, ?, ?)';

  connection.execute(query, [name, imagePath, description, price], (err, results) => {
    if (err) {
      console.error('Error inserting product data: ' + err.stack);
      return res.json({ success: false, message: 'Failed to add product!' });
    }

    res.json({ success: true, message: 'Product added successfully!' });
  });
});

// Endpoint to get all products
app.get('/getProducts', (req, res) => {
  const query = 'SELECT * FROM products';

  connection.execute(query, (err, results) => {
    if (err) {
      console.error('Error fetching products: ' + err.stack);
      return res.json({ success: false, message: 'Failed to retrieve products!' });
    }

    res.json({ success: true, products: results });
  });
});

app.get('/checkout', (req, res) => {
    const query = 'SELECT SUM(price) AS total_price FROM products';

    connection.execute(query, (err, results) => {
        if (err) {
            console.error('Error fetching total price: ' + err.stack);
            return res.status(500).send('Server Error');
        }

        const totalPrice = results[0].total_price || 0; // Handle case where no products exist
        res.render('checkout', { totalPrice: totalPrice });
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


// Optional route to see order history
app.get('/orders', (req, res) => {
    const query = 'SELECT * FROM orders ORDER BY timestamp DESC';

    connection.query(query, (err, results) => {
        if (err) {
            console.error('❌ Error retrieving orders:', err);
            return res.status(500).json({ success: false });
        }

        res.json({ success: true, orders: results });
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

app.post('/submit-payment', (req, res) => {
    const { name, creditCard, pin, expiry, address, cartData, total } = req.body;

    const orderId = `ORD${Date.now()}`;
    const cartJSON = JSON.stringify(JSON.parse(cartData)); // convert to proper JSON string

    const query = `
        INSERT INTO orders (order_id, name, credit_card, pin, expiry, address, total, cart)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [orderId, name, creditCard, pin, expiry, address, total, cartJSON];

    connection.execute(query, values, (err, results) => {
        if (err) {
            console.error('❌ Error saving order:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }

        console.log('✅ Order saved:', orderId);
        res.redirect('/confirmation.html');
    });
});

app.post('/save-payment', (req, res) => {
  let { cardholderName, cardNumber, pin, expiry, address } = req.body;

  // 🔍 Log the incoming data from the frontend
  console.log("Incoming payment data:", {
    cardholderName,
    cardNumber,
    pin,
    expiry,
    address
  });

  // Format values
  cardholderName = cardholderName || null;
  cardNumber = cardNumber || null;
  pin = pin || null;
  expiry = expiry ? `${expiry}-01` : null;
  address = address || null;

  // SQL query
  const query = `
    INSERT INTO payment_info (cardholder_name, card_number, pin, expiry, address)
    VALUES (?, ?, ?, ?, ?)
  `;

  const params = [cardholderName, cardNumber, pin, expiry, address];

  // 🔍 Log the SQL and parameters
  console.log("Executing SQL:", query);
  console.log("With parameters:", params);

  connection.execute(query, params, (err, results) => {
    if (err) {
      console.error("❌ MySQL Error:", err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    console.log("✅ Payment info saved successfully.");
    res.json({ success: true });
  });
});


app.get('/latest-payment', (req, res) => {
    const query = `
        SELECT * FROM payments
        ORDER BY timestamp DESC
        LIMIT 1
    `;

    connection.query(query, (err, results) => {
        if (err) {
            console.error('❌ Error fetching payment info:', err);
            return res.status(500).json({ success: false });
        }

        if (results.length === 0) {
            return res.json({ success: true, payment: null });
        }

        res.json({ success: true, payment: results[0] });
    });
});






