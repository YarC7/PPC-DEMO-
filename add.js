const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http');
const fs = require('fs');
const sql = require('mssql');
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
const path = require('path');
// Configuration for SQL Server connection
const config = {
    user: 'sa',
    password: '123456',
    server: 'CANHW13U',
    database: 'QUANLYBDS_0302',
    options: {
      trustedconnection: true,
      enalbleArithAbort: true,
      encrypt: true, // For encrypted connections
      trustServerCertificate: true // For self-signed certificates
    },
    dialectOptions: {
      "instanceName": "SQLEXPRESS"
    }
  
};


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/demo.html');
});

app.get('/viewlist', async (req, res) => {
    try {
      await sql.connect(config);
  
      const result = await sql.query`SELECT Full_Contract_Code, Customer_Name, Year_Of_Birth FROM Full_Contract`;
  
      let htmlTemplate = fs.readFileSync(__dirname + '/demo2.html', 'utf8');
  
      let htmlData = '<table border="1"><tr>';
  
      Object.keys(result.recordset[0]).forEach(column => {
        htmlData += `<th>${column}</th>`;
      });
      htmlData += '<th>Actions</th></tr>';
  
      result.recordset.forEach(row => {
        htmlData += '<tr>';
        Object.values(row).forEach(value => {
          htmlData += `<td>${value}</td>`;
        });
        htmlData += `<td><button class="btn"><i class="fa fa-edit"></i></button> <button class="btn"><i class="fa fa-close"></i></button></td>`;
        htmlData += '</tr>';
      });
  
      htmlData += '</table>';
  
      // Thay thế placeholder trong tệp demo2.html bằng dữ liệu HTML từ truy vấn SQL
      htmlTemplate = htmlTemplate.replace('<!-- INSERT_DATA -->', htmlData);
  
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(htmlTemplate);
    } catch (err) {
      console.error('Error:', err);
      res.status(500).send('Internal Server Error');
    } finally {
      try {
        await sql.close();
      } catch (err) {
        console.error('Error closing SQL connection:', err);
      }
    }
  });

// Serve the HTML form
app.get('/add-fc', (req, res) => {
    res.sendFile(__dirname + '/demo3.html');
});

// Handle form submission
app.post('/submit', async (req, res) => {
    try {
        const {
            customerName,
            yearOfBirth,
            ssn,
            customerAddress,
            mobile,
            propertyID,
            dateOfContract,
            price,
            deposit,
            remain,
            status
        } = req.body; // Assuming form fields correspond to these names

        // Validate required fields
        if (!customerName || !dateOfContract || !price || !deposit || !remain || !status) {
            return res.status(400).send("Required fields are missing");
        }

        // Connect to the database
        await sql.connect(config);

        // Create a prepared statement to insert data into a table
        const request = new sql.Request();
        const query = `INSERT INTO Full_Contract (Customer_Name, Year_of_Birth, SSN, Customer_Address, Mobile, Property_ID, Date_Of_Contract, Price, Deposit, Remain, Status) VALUES (@customerName, @yearOfBirth, @ssn, @customerAddress, @mobile, @propertyID, @dateOfContract, @price, @deposit, @remain, @status)`
        request.input('customerName', sql.VarChar, customerName);
        request.input('yearOfBirth', sql.VarChar, yearOfBirth);
        request.input('ssn', sql.VarChar, ssn);
        request.input('customerAddress', sql.VarChar, customerAddress);
        request.input('mobile', sql.VarChar, mobile);
        request.input('propertyID', sql.VarChar, propertyID);
        request.input('dateOfContract', sql.Date, dateOfContract);
        request.input('price', sql.Decimal, price);
        request.input('deposit', sql.Decimal, deposit);
        request.input('remain', sql.Decimal, remain);
        request.input('status', sql.VarChar, status);

        // Execute the query
        await request.query(query);

        res.send('Data added successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
