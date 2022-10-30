const mysql =  require('mysql');
databaseFns = {};


databaseFns.deleteFromDB = (tableName, IDColumnName, ID, connection) => {
    const deleteQuery = `DELETE FROM ${tableName} WHERE ${IDColumnName} = ${ID}`;
    connection.query(deleteQuery, (error, results, fields) => {
        if (error) {
            console.error(error);
            return;
        } else if (results) {
            console.log(results);
            return results;
        }
    });
}

databaseFns.getSpecificTableColumns = (connection, tableName, columnsToRead, res) => {
    let selectionQuery = "SELECT "
    columnsToRead = JSON.parse(columnsToRead);
    const numOfColumnsToRead = columnsToRead.length - 1;
    columnsToRead.forEach((columnName, index) => {
        if (index < numOfColumnsToRead) {
            selectionQuery += `${columnName}, `
        } else {
            selectionQuery += `${columnName} `;
        }
    });
    selectionQuery += `FROM ${tableName}`;
    const consultResult = connection.query(selectionQuery, (error, results, fields) => {
        if (error) {
            console.error(error);
        } else if (results) {
            console.log(results);
            res.send(results);
            res.end();
        }
    });
    return consultResult;
}

/*
    {
        columnName: value

    }
*/
databaseFns.filterTableRows = (connection, tableName, conditionObj, res) => {
    const condition = Object.values(conditionObj)[0];
    const columnName = Object.keys(conditionObj)[0];
    const selectionQuery = `SELECT * FROM  ${tableName} WHERE ${columnName} = '${condition}'`;
    const consultResult = connection.query(selectionQuery, (error, results, fields) => {
        if (error) {
            console.error();
        } else if (results) {
            console.log(results);
            res.send(results);
            res.end();
        }
    })
    return consultResult;
}

module.exports = databaseFns;