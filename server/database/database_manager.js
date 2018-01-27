/**
 * @fileoverview The interface object for working with the database
 * @author astral.cai@queensu.ca (Astral Cai)
 */

"use strict";

const config = require('../config/config');
const Sequelize = require('sequelize');
const lit = require('../utilities/literals');
const tables = require('../config/tables');
const errors = require('../utilities/error');
const _ = require('underscore');
const User = require('./user');
const HousingGroup = require('./housing_group');

/**
 * The interface object for working with the database.
 */
class DatabaseManager {
    /**
     * Creates a new user and saves it to the database
     * @param {Object} values - Basic user information required to create a new user
     * @param {String} values.netId - The netID of the new user, once set, cannot be changed
     * @param {String} values.name - The name of the new user
     * @param {String} [values.email] - The email of the new user
     * @return {Promise<User|DatabaseError>} resolves a User object
     */
    createUser(values) {
        return new Promise((resolve, reject) => {
            let thisUser;
            this.models_[lit.tables.USERS].findById(values[lit.fields.USER.ID]).then(user => {
                // user is resolved as a Sequelize model instance
                if (user != null) {
                    throw new errors.DuplicateEntryError('This user already exists in the database');
                }
                return this.models_[lit.tables.USERS].create(values);
            }).then(user => {
                thisUser = new User(user); // create wrapper User object around the Sequelize instance resolved
                return user.createProfile({}); // create empty profile
            }).then(profile => {
                return profile.createPreference({}); // create empty preference profile
            }).then(() => {
                return resolve(thisUser); // resolve the wrapper User object
            }).catch(error => {
                if (error instanceof errors.BaseError)
                    return reject(error);
                if (error instanceof Sequelize.ValidationError)
                    return reject(new errors.IllegalEntryError(error.message));
                return reject(new errors.FailedQueryError(error.message));
            });
        });
    }

    /**
     * Gets a User object with the netId of the user, returns null if nothing is found
     * @param {String} userId
     * @returns {Promise<User|DatabaseError>} The User object found or null if this user doesn't exist
     */
    getUserById(userId) {
        return new Promise((resolve, reject) => {
            return this.models_[lit.tables.USERS].findById(userId).then(user => {
                // user returned as a Sequelize model instance
                if (user == null)
                    return resolve(null);
                return resolve(new User(user)); // resolve new User wrapper object around Sequelize instance
            }).catch(error => {
                return reject(new errors.FailedQueryError(error.message));
            });
        });
    }

    /**
     * gets a HousingGroup object by its unique Id number
     *
     * @param {Integer} groupId - The unique id of the group
     * @return {Promise<HousingGroup>}
     */
    getHousingGroupById(groupId) {
        return new Promise((resolve, reject) => {
            this.models_[lit.tables.HOUSING_GROUPS].findById(groupId).then(instance => {
                // instance is resolved as a Sequelize model instance
                if (instance == null)
                    return resolve(null);
                return resolve(new HousingGroup(instance)); // resolve wrapper HousingGroup object
            }).catch(err => {
                return reject(new errors.FailedQueryError(error.message));
            });
        });
    }

    /**
     * gets the HousingGroup that a given User belongs to, resolves 'null' if the user
     * does not belong to any housing group
     *
     * @param {User} user
     * @returns {Promise<HousingGroup>}
     */
    getHousingGroupByUser(user) {
        return new Promise((resolve, reject) => {
            user.instance_.getHousingGroup().then(group => {
                if (group == null)
                    return resolve(null);
                return resolve(new HousingGroup(group)); // resolve wrapper HousingGroup object
            }).catch(err => {
                return reject(new errors.FailedQueryError(error.message));
            });
        });
    }

    /**
     * creates a housing group with a user as the first member of the group
     *
     * @param {User} initiator - The initiator of the housing group
     * @param {Integer} groupSize - The intended size of the housing group
     * @returns {Promise<HousingGroup>}
     */
    createHousingGroup(initiator, groupSize) {
        return new Promise((resolve, reject) => {
            return initiator.instance_.getHousingGroup().then(group => {
                // group is a Sequelize model instance or null
                if (group != null)
                    throw new errors.InvalidOperationError('This user already belongs to a group');
                if (groupSize <= 1)
                    throw new errors.IllegalEntryError('the group size must be bigger than 1');
                return this.models_[lit.tables.HOUSING_GROUPS].create({size: groupSize, spotsLeft: groupSize - 1});
            }).then(group => {
                // group is a Sequelize model instance
                return group.addMember(initiator.instance_);
            }).then(group => {
                return group.setInitiator(initiator.instance_);
            }).then(group => {
                return resolve(new HousingGroup(group)); // resolve wrapper object around Sequelize instance
            }).catch(error => {
                if (error instanceof errors.BaseError)
                    return reject(error);
                return reject(new errors.FailedQueryError(error.message));
            });
        });
    }

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
        _.each(tables, (value, key, obj) => {
            if ('associations' in value) {
                obj[key].associations(thisManager.models_);
            }
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