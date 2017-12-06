/**
 * @fileoverview The interface object for working with the database
 * @author astral.cai@queensu.ca (Astral Cai)
 */

"use strict";

const config = require('../config/config');
const Sequelize = require('sequelize');
const lit = require('../utilities/literals');
const tables = require('../config/tables');
const User = require('./user');

/**
 * The interface object for working with the database.
 */
class DatabaseManager {
    /**
     * The constructor initializes a database connection using Sequelize
     */
    constructor() {
        this.connection_ = new Sequelize(config.db_config[lit.DB_DATABASE],
            config.db_config[lit.DB_USERNAME], config.db_config[lit.DB_PASSWORD], {
                host: config.db_config[lit.DB_HOST],
                port: config.db_config[lit.DB_PORT],
                pool: {
                    max: config.db_config[lit.DB_CONNECTION_LIMIT]
                },
                dialect: 'mysql',
                operatorsAliases: false
            });
        let thisManager = this;
        Object.keys(tables).forEach((key) => {
            let table = tables[key];
            let con = thisManager.connection_;
            thisManager[table.table_name] = con.define(table.table_name, table.fields);
        });
    }

    /**
     * Creates a new user and saves it to the database
     * @param {Object} values Basic user information required to create a new user
     * @return {Promise<User|DatabaseError>} resolves a User object
     */
    createUser(values) {
        return User.createUser(values, this[lit.tables.USERS]);
    }

    /**
     * checks if a user with a provided netID exist in the database
     * @param userID
     * @returns boolean
     */
    existsUser(userID) {
        this[lit.tables.USERS].findById(userID).then((result) => {
            return result != null;
        });
    }

    /**
     * updates the schema of the database.
     * @returns {Promise}
     */
    sync() {
        return this.connection_.sync();
    }
}

module.exports = DatabaseManager;