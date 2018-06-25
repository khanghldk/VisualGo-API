var mysql = require('mysql');
var connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'worldcup@2022',
    database: 'VisualGoTure'

});
module.exports = connection;