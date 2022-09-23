const express = require('express');
const app = express();
const morgan = require('morgan');
const mysql = require('mysql');
const cors = require('cors');


//SETTINGS
app.set('port', 3000);

//MIDDLEWARES
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: false}));


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nutriliosdb'
});

connection.connect((err) => {
    if (err) throw err;
    console.log("Connected to database");
})

//ROUTES
app.get('/', (req, res) => {
    res.send('Hello world');
});

app.post('/getAllTableData', (req, res) => {
    const {tableName} = req.body;
    const readQuery = `SELECT * FROM ${tableName}`;
    connection.query(readQuery, (error, results, fields) => {
        if (error) {
            console.error(error);
            res.end();
            return;
        } else if (results) {
            res.send(results);
        }
    });
});

app.post('/insertIntoDB', (req,res) => {
    const {tableName, tableColumns, insertValues} = req.body;
    const numOfColumns = tableColumns.length;
    const numOfValues = insertValues.length;
    let query = `INSERT INTO ${tableName} (`;
    tableColumns.forEach((columnName, index) => {
        query += `${columnName}`;
        if(index + 1 === numOfColumns) {
            query += ') '; 
        } else {
            query += ', ';
        }
    });
    query += `VALUES (`;
    insertValues.forEach((value, index) => {
        query +=`'${value}'`
        if (index + 1 === numOfValues) {
            query += ') ';
        } else {
            query += ', ';
        }
    });
    connection.query(query, (error, results, fields) => {
        if (error) {
            console.error(error);
            res.end();
            return;
        } else if (results) {
            res.send('200');
            console.log('Insertado con insertIntoDB todo bn todo bn');
            console.log(results);
        }
    });
});

app.post('/updateTableRecord', (req, res) => {
    const {tableName, tableColumns, updateValues, recordID, identifier} = req.body;
    const columnsLength = tableColumns.length;
    let updateQuery = `UPDATE ${tableName} SET `;
    tableColumns.forEach((columnName, index) => {
        if (index + 1 < columnsLength) {
            updateQuery += `'${columnName}' = ?, `
        } else {
            updateQuery += `'${columnName}' = ? `
        }
    });
    updateQuery += `WHERE ${identifier} = ${recordID}`;
    console.log(updateQuery);
    connection.query(updateQuery, updateValues, (error, results, rows, fields) => {
        if (error) {
            console.error(error);
            res.end();
            return;
        } else if (results) {
            console.log('Updateado todo bnn')
            console.log(results);
            res.send();
        }
    })
});

//INITIALIZING SERVER
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`)
});