const mysql =  require('mysql');
databaseFns = {};


databaseFns.updateRow = (db, updateData, updateID, tableName, res) => {
    let updateQuery = `UPDATE ${tableName} set `;
    //RECIBE JSON CON INFORMACION A UPDEATEAR
    const fildsToUpdate = Object.keys(updateData).length;
    Object.entries(updateData).forEach(([columnName, content], index) => {
        if (index + 1 < fildsToUpdate) {
            updateQuery += `${columnName} = '${content}', `
        } else {
            updateQuery += `${columnName} = '${content}'`
        }
    });
    console.log(updateQuery);
    db.run(updateQuery, updateID, (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log('data changed all good');
            res.send(true);
        }
    })
}

databaseFns.getLastInsertID = (tablename, identifierColumn, db) => {
    const maxQuery = `SELECT MAX(${identifierColumn}) FROM ${tablename}`
    return new Promise((slvr, reject) => {
        db.all(maxQuery, [], (err, rows) => {
            if (err) {
                console.error(err);
            } else if (rows) {
                debugger;
                console.log(rows);
                slvr(rows[0][`MAX(${identifierColumn})`]);
            }
        });
    });
}

databaseFns.insertIntoDB = (tableName, tableColumns, insertValues, db) => {
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
    return new Promise((promiseResults, rej) => {
        db.serialize(() => {
            db.run(query, [], (err, rows) => {
                if (err) {
                    console.error(err);
                } else {
                    debugger;
                    promiseResults(true);
                }
            });
        })
    });
}

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

databaseFns.getSpecificTableColumns = (db, tableName, columnsToRead, res) => {
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
    const consultResult = db.all(selectionQuery, [], (error, results) => {
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
databaseFns.filterTableRows = (db, tableName, conditionObj, res) => {
    const condition = Object.values(conditionObj)[0];
    const columnName = Object.keys(conditionObj)[0];
    const selectionQuery = `SELECT * FROM  ${tableName} WHERE ${columnName} = '${condition}'`;
    const consultResult = db.all(selectionQuery, [] ,(error, results) => {
        if (error) {
            console.error();
        } else if (results) {
            res.send(results);
            res.end();
        }
    });
    return consultResult;
}

module.exports = databaseFns;