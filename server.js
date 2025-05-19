const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Balllife45',
  database: 'iot'
});

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
  
