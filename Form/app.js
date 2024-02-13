const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = 3000;

// MySQL Connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Password',
    database: 'html_form'
});

connection.connect();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => {
    res.render('form');
});

app.post('/submit', (req, res) => {
    const { name, email, message } = req.body;
    const formData = { name, email, message };

    connection.query('INSERT INTO details SET ?', formData, (error, results) => {
        if (error) throw error;
        res.render('form', { successMessage: 'Successfully submitted data!' });
    });
});


app.get('/details', (req, res) => {
    connection.query('SELECT * FROM details', (error, results) => {
        if (error) throw error;
        res.render('details', { formData: results });
    });
});

// Server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
