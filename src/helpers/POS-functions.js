const mysql = require('mysql');
const databaseFns = require('./database-functions');
pointOfSaleFns = {}

pointOfSaleFns.registerSale = () => {

}

// pointOfSaleFns.getProductsForSale = (connection, params) => {
//     const {tableName, columnsToRead} = params;
//     return databaseFns.getSpecificTableColumns(connection, tableName, columnsToRead);
// }

module.exports = pointOfSaleFns