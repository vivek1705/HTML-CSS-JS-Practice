const express = require('express');
const session = require('express-session');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Use express-session to manage sessions
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
}));

// MySQL Connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Password',
  database: 'loginregister',
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/dashboard', authenticateUser, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    res.redirect('/');
  });
});

app.post('/register', async (req, res) => {
  const { name, age, gender, email, phone, qualification, address, password } = req.body;

  // Hash the password before storing it
  const hashedPassword = await bcrypt.hash(password, 10);

  const insertQuery = `INSERT INTO users (name, age, gender, email, phone, qualification, address, password) 
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  
  connection.query(insertQuery, [name, age, gender, email, phone, qualification, address, hashedPassword], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error registering user');
    } else {
      res.redirect('/');
    }
  });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const selectQuery = 'SELECT * FROM users WHERE email = ?';
  connection.query(selectQuery, [username], async (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error during login');
    } else if (results.length > 0) {
      const match = await bcrypt.compare(password, results[0].password);
      if (match) {
        req.session.userId = results[0].id;
        res.redirect('/dashboard');
      } else {
        res.status(401).send('Incorrect password');
      }
    } else {
      res.status(404).send('User not found');
    }
  });
});

// Middleware to check if user is authenticated
function authenticateUser(req, res, next) {
  if (req.session.userId) {
    return next();
  } else {
    res.redirect('/');
  }
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
