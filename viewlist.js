const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http');
const fs = require('fs').promises;
const sql = require('mssql');
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));
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

// Create HTTP server
const server = http.createServer(async (req, res) => {
  try {
    if (req.url === '/' || req.url === '/demo2.html') {
      const html = await fs.readFile('demo2.html', 'utf8');
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
    } else if (req.url === '/sqlData') {
      // Connect to the database
      await sql.connect(config);

      

      // Query to fetch data from a table (replace 'YourTableName' with your table name)
      const result = await sql.query`SELECT Full_Contract_Code
                                            ,Customer_Name
                                            ,Year_Of_Birth
                                      FROM Full_Contract`;

      // HTML table creation
      let html = '<!DOCTYPE html><html><head><title>SQL Data</title></head><body>';
      html += '<h1>SQL Data</h1><table border="1"><tr>';

      // Creating table headers
      Object.keys(result.recordset[0]).forEach(column => {
        html += `<th>${column}</th>`;
      });
      html += '<th>Actions</th></tr>'; // Adding the 'Actions' column header      

      // Adding rows to the table
      result.recordset.forEach(row => {
        html += '<tr>';
        Object.values(row).forEach(value => {
          html += `<td>${value}</td>`;
        });
        html += `<td><button class="btn"><i class="fa fa-edit"></i></button> <button class="btn"><i class="fa fa-close"></i></button></td>`; 
        html += '</tr>';
      });

      html += '</table></body></html>';

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  } catch (err) {
    console.error('Error:', err);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  } finally {
    // Close SQL connection
    try {
      await sql.close();
    } catch (err) {
      console.error('Error closing SQL connection:', err);
    }
  }
});


app.use(bodyParser.urlencoded({ extended: true }));

// app.post('/submitForm', async (req, res) => {
//   const {
//     customerName,
//     yearOfBirth,
//     ssn,
//     customerAddress,
//     mobile,
//     propertyID,
//     dateOfContract,
//     price,
//     deposit,
//     remain,
//     status
//   } = req.body;

//   try {
//       await sql.connect(config);
//       const request = new sql.Request();
//       await request.query(`INSERT INTO Full_Contract (Customer_Name, Year_Of_Birth, SSN, Customer_Address, Mobile, Property_ID, Date_Of_Contract, Price, Deposit, Remain, Status) 
//                            VALUES (${customerName}, ${yearOfBirth}, ${ssn}, ${customerAddress}, ${mobile}, ${propertyID}, ${dateOfContract}, ${price}, ${deposit}, ${remain}, ${status});`);
      
//       res.status(200).send('Data added to the database');
//   } catch (error) {
//       console.error('Error:', error);
//       res.status(500).send('Error adding data to the database');
//   } finally {
//       await sql.close();
//   }
// });


// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});