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

app.post('/pointOfSale', async (req, res) => {
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
            const { soldProducts } = params;
            let productDataPromises = [];
            JSON.parse(soldProducts).forEach((prod) => {
                productDataPromises.push(databaseFns.selectSpecificRow(db, 'products', {product_id: prod.product_id}))
            });
            const soldProductsData = await Promise.all(productDataPromises);
            const dbUpdatesPromises = [];
            let dbUpdates;
            JSON.parse(soldProducts).forEach((prod) => {
                const product = soldProductsData.find((soldProd) => soldProd.product_id === prod.product_id );
                dbUpdatesPromises.push(databaseFns.updateRow(db, {product_stock: parseInt(product.product_stock) - parseInt(prod.unites)}, prod.product_id, 'products', 'product_id'));
            });
            try {
                dbUpdates = Promise.all(dbUpdatesPromises);
            } catch (error) {
                dbUpdates = false;
            }
            // const productInStock = await (databaseFns.filterTableRows(db, 'products', {product_id: productID}))[0].product_stock;
            // if (!productInStock) {
            //     return;
            // }

            // const updateQuery = `UPDATE products set product_stock = '${parseInt(productInStock) - parseInt(soldUnits)}' WHERE product_id= (?)`
            // db.run(updateQuery, productID, (err) => {
            //     if (err) {
            //         console.error(err);
            //     } else {
            //         console.log('Data changed in inventary');
            //     }
            // });
            debugger;
            break;
    }
});

app.post('/distribuidores', async (req, res) => {
    const {action, params} = req.body;
    switch (action) {
        case 'registerNewDistribuidor':
            const {tableColumns, insertValues} = params;
            const insertResponse = await databaseFns.insertIntoDB('distribuidores', tableColumns, insertValues, db);
            if (insertResponse) {
                const distribuidorInsertID = await databaseFns.getLastInsertID('distribuidores', 'distribuidor_id', db)
                console.log('Inserted distribuidor', distribuidorInsertID);
                res.send(JSON.stringify(distribuidorInsertID));
            } else {
                res.end();
            }
        break;
        case 'deleteDistribuidor' : 
        const {distribuidorID} = params;
        const deleteResponse = await databaseFns.deleteFromDB('distribuidores', 'distribuidor_id', distribuidorID, db);
        if (deleteResponse) {
            res.send(true);
        } else {
            res.end();
        }
        break;
        case 'editDistribuidor' : 
        const {distribuidorId, distribuidorData} = params;
        const updateResponse = await databaseFns.updateRow(db, distribuidorData, distribuidorId, 'distribuidores', 'distribuidor_id');
        if (updateResponse) {
            res.send(true);
        } else {
            res.end();
        }
    }
});

app.post('/users', async (req, res) => {
    const {action, params} = req.body;
    switch (action) {
        case 'registerNewUser' :
            const {tableColumns, insertValues} = params; 
            const insertResponse = await databaseFns.insertIntoDB('users', tableColumns, insertValues, db);
            if (insertResponse) {
                const userInsertID = await databaseFns.getLastInsertID('users', 'user_id', db);
                console.log('El ID donde debe ir', userInsertID);
                res.send(JSON.stringify(userInsertID));
            }
        break;
        case 'deleteUser' : 
        const {userID} = params;
        const deleteResponse = await databaseFns.deleteFromDB('users', 'user_id', userID, db);
        if (deleteResponse) {
            res.send(true);
        } else {
            res.end();
        }
        break;
        case 'editUser': 
        const {userId, userData} = params;
        const updateUserResponse = await databaseFns.updateRow(db, userData, userId, 'users', 'user_id');
        if (updateUserResponse) {
            res.send(true);
        } else {
            res.send(false);
            res.end();
        }
        break;
        case 'authUser': 
        const {userEmail, password, adminValidate } = params;
        const conditionObj = {user_email: userEmail}
        const selectedUserResponse = await databaseFns.filterTableRows(db, 'users', conditionObj);
        if (selectedUserResponse) {
            let responseObj = {
                status: true,
                message: 'all good'
            }
            if (!selectedUserResponse.length) {
                responseObj.status = false;
                responseObj.message = 'Trata de ingresar con un correo no registrado'
                res.send(responseObj);
                res.end();
                return;
            }
            const userData = selectedUserResponse[0];
            if (userData.user_password !== password) {
                responseObj.status = false;
                responseObj.message = 'Contraseña incorrecta'
                res.send(responseObj);
                res.end();
                return;
            }
            if (adminValidate) {
                if (userData.user_role !== 'admin') {
                    responseObj.status = false;
                    responseObj.message = 'Este usuario no cuenta con los permisos necesarios';
                    res.send(responseObj);
                    res.end();
                    return;
                }
            }
            res.send(responseObj);
            res.end();
            return;
        }
        res.send({status: false, message:'Algo salio mal'});
        res.end();
        return;
    
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
        case 'deleteInventaryProduct': 
        const {productID} = params;
        const deleteResponse = await inventaryFns.deleteProduct(db, productID);
        if (deleteResponse) {
            res.send(true);
        } else {
            res.send(false);
            res.end();
        }
        break;
    }
});


app.post('/adminCuts', async (req, res) => {
    const {action, params} = req.body;
    switch (action) {
        case 'getDateSales' :
            const {tableName, conditionObj} = params;
            const selectedDateSalesResponse = await databaseFns.filterTableRows(db, tableName, conditionObj);
            if (selectedDateSalesResponse) {
                res.send(selectedDateSalesResponse);
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