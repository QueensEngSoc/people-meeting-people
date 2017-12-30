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
        this.models_ = {};
        let thisManager = this;
        let thisConnection = this.connection_;
        for (let key in tables) {
            if (!tables.hasOwnProperty(key)) {
                break;
            }
            let table = tables[key];
            thisManager.models_[table.table_name] = thisConnection.define(table.table_name, table.fields);
        }
        Object.keys(tables).forEach((key) => {
            if ('associations' in tables[key]) {
                tables[key].associations(thisManager.models_);
            }
        });
    }

    /**
     * Creates a new user and saves it to the database
     * @param {Object} values - Basic user information required to create a new user
     * @param {String} values.netID - The netID of the new user, once set, cannot be changed
     * @param {String} values.name - The name of the new user
     * @param {String} values.email - The email of the new user
     * @return {Promise<User|DatabaseError>} resolves a User object
     */
    createUser(values) {
        return User.createUser(values, this.models_[lit.tables.USERS]);
    }

    /**
     * checks if a user with a provided netID exist in the database
     * @param {String} userID
     * @returns {boolean}
     */
    existsUser(userID) {
        this.models_[lit.tables.USERS].findById(userID).then((result) => {
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