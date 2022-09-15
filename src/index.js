const express = require('express');
const app = express();
const morgan = require('morgan');
const mysql = require('mysql');


//SETTINGS
app.set('port', 3000);

//MIDDLEWARES
app.use(morgan('dev'));
app.use(express.json());
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

const readQuery = "SELECT * FROM `productos`"

const readData = connection.query(readQuery, (error, results, fields) => {
    if (error) {
        console.error(error);
        return;
    } else {
        console.log(results);
    }

});
console.log(readData);

//ROUTES
app.get('/', (req, res) => {
    res.send('Hello world');
});


//INITIALIZING SERVER
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`)
});