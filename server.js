const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const session = require('express-session');
const multer = require('multer'); // For handling file uploads

let orderHistory = [];

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const connection = require('./db');
const db = require('./db');

connection.connect(err => {
  if (err) {
    console.error('Error connecting:', err.stack);
    return;
  }
  console.log('Connected to MySQL');
});

// Register new user
app.post('/register', (req, res) => {
  const { fullname, email, phone, password } = req.body;
  if (!fullname || !email || !phone || !password) {
    return res.json({ success: false, message: 'All fields required' });
  }

  const query = 'INSERT INTO customers (fullname, email, phone, password) VALUES (?, ?, ?, ?)';
  connection.execute(query, [fullname, email, phone, password], (err) => {
    if (err) {
      console.error(err);
      return res.json({ success: false, message: 'Failed to register user!' });
    }
    res.json({ success: true, message: 'User registered!' });
  });
});

// Get user by email
app.get('/user', (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ success: false, message: 'Email required' });

  const query = 'SELECT user_id, email, password FROM customers WHERE email = ?';
  connection.execute(query, [email], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    if (results.length === 0) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, user: results[0] });
  });
});

// Log login attempt
app.post('/log-login', (req, res) => {
  const { user_id } = req.body;
  if (!user_id) return res.status(400).json({ success: false, message: 'User ID required' });

  const query = 'INSERT INTO accesslog (user_id, login_time) VALUES (?, NOW())';
  connection.execute(query, [user_id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Insert failed' });
    }
    res.json({ success: true, message: 'Login logged', accessLogId: result.insertId });
  });
});

// Log logout attempt
app.post('/logout-log', (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ success: false, message: 'Log ID required' });

  const query = 'UPDATE accesslog SET logout_time = NOW() WHERE id = ?';
  connection.execute(query, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Logout log failed' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'No matching log found' });
    }
    res.json({ success: true, message: 'Logout logged' });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Fetch Registration Details for a Logged-in User
app.get('/user/details', (req, res) => {
    const { email } = req.query;
    if (!email) return res.status(400).json({ success: false, message: 'Email required' });
  
    const query = 'SELECT fullname, email, phone FROM customers WHERE email = ?';
    connection.execute(query, [email], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Database error' });
      }
      if (results.length === 0) return res.status(404).json({ success: false, message: 'User not found' });
  
      // Send the user registration details back
      res.json({
        success: true,
        user: results[0],
      });
    });
  });

  // Get access logs by user_id and specific date
app.get('/user/logs', (req, res) => {
    const { user_id, date } = req.query;
  
    if (!user_id || !date) {
      return res.status(400).json({ success: false, message: 'User ID and date are required' });
    }
  
    const query = `
      SELECT login_time, logout_time
      FROM accesslog
      WHERE user_id = ?
      AND DATE(login_time) = ?
      ORDER BY login_time DESC
    `;
  
    connection.execute(query, [user_id, date], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ success: false, message: 'Database error' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ success: false, message: 'No logs found for that date' });
      }
  
      res.json({ success: true, logs: results });
    });
  });


// Cancel (delete) user registration
app.delete('/user', (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });
  
    // Only delete user from customers, keep accesslog entries
    const query = 'DELETE FROM customers WHERE email = ?';
  
    connection.execute(query, [email], (err, result) => {
      if (err) {
        console.error('Error deleting user:', err);
        return res.status(500).json({ success: false, message: 'Database error' });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      res.json({ success: true, message: 'User registration cancelled, access logs retained.' });
    });
  });
    
  // Update user registration details (including email)
app.put('/user/update', (req, res) => {
    const { originalEmail, newEmail, fullname, phone, password } = req.body;
  
    if (!originalEmail || !newEmail || !fullname || !phone || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
  
    const query = `
      UPDATE customers 
      SET fullname = ?, phone = ?, password = ?, email = ?
      WHERE email = ?
    `;
  
    connection.execute(query, [fullname, phone, password, newEmail, originalEmail], (err, result) => {
      if (err) {
        console.error('Update error:', err);
        return res.status(500).json({ success: false, message: 'Database error' });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      res.json({ success: true, message: 'Profile updated successfully' });
    });
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

app.post('/save-payment', (req, res) => {
  const { cardholderName, cardType, cardNumber, pin, expiry, address } = req.body;

  const insertPayment = `
    INSERT INTO payments (cardholderName, cardType, cardNumber, pin, expiry, address)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  connection.query(insertPayment, [cardholderName, cardType, cardNumber, pin, expiry + '-01', address], (err, results) => {
    if (err) {
      console.error('Error saving payment:', err);
      return res.status(500).send('Error saving payment');
    }
  });
  console.log('✅ Payment saved:', { cardholderName, cardType, cardNumber, pin, expiry, address });
});

app.post('/submit-payment', (req, res) => {
  const { name, cardType, creditCard, pin, expiry, address } = req.body;

  const maskedCard = creditCard.slice(-4); // Only store last 4 digits

  const query = `
    REPLACE INTO payments (id, cardholderName, cardType, cardNumber, pin, expiry, address)
    VALUES (1, ?, ?, ?, ?, ?, ?)
  `;

  connection.query(query, [name, cardType, maskedCard, pin, expiry, address], (err) => {
    if (err) {
      console.error('Failed to save payment:', err);
      return res.status(500).send('Internal server error');
    }
    res.redirect('/confirmation.html'); // Or show a thank-you message
  });
});


app.get('/payment', (req, res) => {
  const query = 'SELECT id, cardholderName, cardType, cardNumber, expiry, address, created_at FROM payments ORDER BY created_at DESC';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching payments:', err);
      return res.status(500).send('Error fetching payments');
    }

    // Optional: Mask card numbers
    const maskedResults = results.map(payment => ({
      ...payment,
      cardNumber: payment.cardNumber.replace(/\d{12}(\d{4})/, '**** **** **** $1') // mask first 12 digits
    }));

    res.json(maskedResults); // return JSON to front-end
  });
});
