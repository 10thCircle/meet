const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();
const port = ___; // Fill in the port number (e.g., 3000)

// Middleware to parse JSON data
app.use(bodyParser.json());

// Serve static files (HTML, CSS, JS) from the current directory
app.use(express.static(__dirname));

// Create a connection to the database
const connection = mysql.createConnection({
  host: '___', // Fill in your database host (e.g., 'localhost' or an IP address)
  user: '___', // Fill in your database username
  password: '___', // Fill in your database password
  database: '___' // Fill in your database name
});

// Connect to the database
connection.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
    return;
  }
  console.log('Connected to the SQL server.');
});

// API endpoint to fetch data from the database
app.get('/api/data', (req, res) => {
  const query = 'SELECT * FROM ___'; // Fill in your table name
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err.message);
      res.status(500).send('Error fetching data');
      return;
    }
    res.json(results); // Send the query results as JSON
  });
});

// API endpoint to handle user login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body; // Expecting email and password from the client
  const query = 'SELECT * FROM users WHERE email = ? AND password = ?'; // Replace 'users' with your table name
  connection.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('Error during login:', err.message);
      res.status(500).send('Error during login');
      return;
    }
    if (results.length > 0) {
      res.json({ loggedIn: true, user: results[0] }); // Send user data if login is successful
    } else {
      res.json({ loggedIn: false, message: 'Invalid email or password' });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});