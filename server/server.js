const express = require('express');
const cors = require('cors');
const sql = require('mssql/msnodesqlv8');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Database configuration
const config = {
    server: 'localhost\\SQLEXPRESS',
    user: 'CHUAKARTZUN-N01\\chuakartzun',
    driver:'msnodesqlv8',
    database: 'Demo',
    options: {
        trustedConnection: true, // Use Windows Authentication
        trustServerCertificate: true // Accept self-signed certificates (for development/testing)
    }
};

// Connect to database
sql.connect(config, err => {
    if (err) {
        console.log('Error connecting to SQL Server:', err);
    } else {
        console.log('Connected to SQL Server');
    }
});

// Routes
app.get('/api/items', async (req, res) => {
    try {
        const result = await sql.query('SELECT * FROM Items');
        res.json(result.recordset);
    } catch (err) {
        console.log('Error querying data:', err);
        res.status(500).json({ error: 'Failed to retrieve data from the server' });
    }
});

app.get('/api/customers', async (req, res) => {
    try {
        const result = await sql.query('SELECT * FROM Customers');
        res.json(result.recordset);
    } catch (err) {
        console.log('Error querying data:', err);
        res.status(500).json({ error: 'Failed to retrieve data from the server' });
    }
});

app.get('/api/salesorder', async (req, res) => {
    try {
        const result = await sql.query('SELECT * FROM SalesOrder');
        res.json(result.recordset);
    } catch (err) {
        console.log('Error querying data:', err);
        res.status(500).json({ error: 'Failed to retrieve data from the server' });
    }
});

app.get('/api/suppliers', async (req, res) => {
    try {
        const result = await sql.query('SELECT * FROM Suppliers');
        res.json(result.recordset);
    } catch (err) {
        console.log('Error querying data:', err);
        res.status(500).json({ error: 'Failed to retrieve data from the server' });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
