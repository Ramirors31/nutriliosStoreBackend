const express = require('express');
const app = express();
const morgan = require('morgan');
const mysql = require('mysql');
const cors = require('cors');
const inventaryFns = require('./src/helpers/inventary-functions');
const databaseFns = require('./src/helpers/database-functions');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

//SETTINGS
app.set('port', 3000);

//MIDDLEWARES
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: false}));
const db = new sqlite3.Database(`${__dirname}/src/db/nutriliosdb.sqlite`, (err) => {
    if (err) {
        return console.error(err);
    }
    console.log('connected to database brah');
});

//ROUTES
app.get('/', (req, res) => {
    res.send('Hello world');
});

app.post('/pointOfSale', (req, res) => {
    const {action, params} = req.body;
    switch (action) {
        case 'getProductsForSale':
            const { columnsToRead} = params;
            const availableProductsResponse = databaseFns.getSpecificTableColumns(db, 'products', columnsToRead, res);
            if (availableProductsResponse) {
                console.log('todo bn')
            } else {
                res.send(709);
                res.end();
            }
        break;
        case 'registerSale' :
            let { productID, productStock, soldUnits } = params;
            debugger;
            const updateQuery = `UPDATE products set product_stock = '${parseInt(productStock) - parseInt(soldUnits)}' WHERE product_id= (?)`
            db.run(updateQuery, productID, (err) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log('Data changed in inventary');
                }
            });
            debugger;
            break;
    }
});

app.post('/inventary', async (req, res) => {
    const {action, params} = req.body;
    switch(action) {
        case 'registerNewProduct':
            const {tableColumns, insertValues} = params; 
            const insertResponse = await databaseFns.insertIntoDB('products', tableColumns, insertValues, db);
            if (insertResponse) {
                const productInsertID = await databaseFns.getLastInsertID('products', 'product_id', db);
                console.log('El ID donde debe ir', productInsertID);
                res.send(JSON.stringify(productInsertID));
            }
        break;
    }
});


app.post('/adminCuts', (req, res) => {
    const {action, params} = req.body;
    switch (action) {
        case 'getDateSales' :
            const {tableName, conditionObj} = params;
            const selectedDateSalesResponse = databaseFns.filterTableRows(db, tableName, conditionObj, res);
            if (selectedDateSalesResponse) {
                console.log('todo bn');
            } else {
                res.send(609);
                res.end();
            }
        }
});

app.post('/getAllTableData', (req, res) => {
    const {tableName} = req.body;
    const readQuery = `SELECT * FROM ${tableName}`;
    db.all(readQuery, [], (err, rows) => {
        if (err) {
            throw err;
        } else if (rows) {
            res.send(rows)
        }
    })
});

app.post('/insertIntoDB', async (req,res) => {
    const {tableName, tableColumns, insertValues} = req.body;
    const response = await databaseFns.insertIntoDB(tableName, tableColumns, insertValues, db);
    console.log('la respuesta es', response);
});

app.post('/deleteFromDB', (req, res) => {
    const {tableName, IDColumnName, ID } = req.body;
    const response = databaseFns.deleteFromDB(tableName, IDColumnName, ID, connection)
    if (response) {
        res.send('200');
        res.end();
    } else {
        res.send('702');
        res.end();
    }
})

app.post('/updateInventaryProduct', (req, res) => {
    const {updateData, productID} = req.body;
    const response = inventaryFns.updateProduct(db, updateData, productID);
    if (response) {
        res.send('200');
        res.end();
        return;
    } else {
        res.send('400');
        res.end();
        return;
    }
});

app.post('/deleteInventaryProduct', (req, res) => {
    const {productID} = req.body;
    const response = inventaryFns.deleteProduct(db, productID);
    if (response) {
        res.send('200');
        res.end();
    } else {
        res.send('506');
        res.end();
    }
})

app.post('/updateTableRecord', (req, res) => {
    const {tableName, tableColumns, updateValues, recordID, identifier} = req.body;
    const columnsLength = tableColumns.length;
    let updateQuery = `UPDATE ${tableName} SET `;
    tableColumns.forEach((columnName, index) => {
        if (index + 1 < columnsLength) {
            updateQuery = updateQuery + '`' + columnName + '` = ?,'   // `'${columnName}' = ?, `
        } else {
            updateQuery = updateQuery + '`' + columnName + '` = ?' //+= `'${columnName}' = ? `
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