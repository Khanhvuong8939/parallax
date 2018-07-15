var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '123465',
    database: 'parallax',
    insecureAuth: true
});

connection.connect();

module.exports = connection;