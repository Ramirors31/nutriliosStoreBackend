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

app.get('/inventaryData', (req, res) => {
    const readQuery = "SELECT * FROM `products`"
    connection.query(readQuery, (error, results, fields) => {
        if (error) {
            console.error(error);
            return;
        } else {
            res.send(results);
        }
    });
});


//INITIALIZING SERVER
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`)
});