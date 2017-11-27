/**
 * @fileoverview function for setting up the database schema
 */

"use strict";

const mysql = require('mysql2/promise');
const config = require('../config/config');
const log = require('../utilities/log');

/**
 * creates a database and its tables if they do not exist
 * @returns {Promise}
 */
module.exports = function () {
    return new Promise((resolve, reject) => {
        mysql.createConnection({
            host: config.db_config.host,
            user: config.db_config.username,
            password: config.db_config.password
        }).then((con) => {
            return con.query('CREATE DATABASE IF NOT EXISTS ' + config.db_config.database);
        }).then((result) => {
            log.log('database created successfully!');
            const DatabaseManager = require('../database/database_manager');
            let dbm = new DatabaseManager();
            return dbm.sync();
        }).then((result) => {
            resolve('database setup successfully!');
        }).catch((error) => {
            reject(error);
        });
    });
};