const mysql = require('mysql');
const config = require('../config/config').db;

function dbsetup() {
    return new Promise(function (resolve, reject) {
        // connection created here
        let con = mysql.createConnection({
            host: config.host,
            user: config.username,
            password: config.password
        });
        con.connect(function (err) {
            if (err) reject(err);
            console.log('database connected!');
            con.query('CREATE DATABASE IF NOT EXISTS ' + config.database, function (err, result) {
                if (err) reject(err);
                let connection = require('../database/database_manager');
                connection.sync();
            })
        });
    })
}

module.exports = dbsetup;