/**
 * @fileoverview The interface object for all operations relating to users
 * @author astral.cai (Astral Cai)
 */

"use strict";

const Sequelize = require('sequelize');
const lit = require('../utilities/literals');
const errors = require('../utilities/error');

/**
 * The interface object for functionality relating to users
 */
class User {
    /**
     *
     * @param {Object} values
     * @param {String} values.name The name of the user
     * @param {String} values.email The email of the user
     * @returns {Promise}
     */
    updateInfo(values) {
        return new Promise((resolve, reject) => {
            if (lit.fields.USER_ID in values) {
                return reject(new errors.IllegalEntryError('Attempting to change netID'));
            }
            this.instance_.update(values).then(resolve).catch(reject);
        });
    }

    constructor(instance) {
        this.instance_ = instance;
    }

    static createUser(values, model) {
        return new Promise((resolve, reject) => {
            model.findById(values[lit.fields.USER_ID]).then((result) => {
                if (result != null) {
                    return reject(new errors.DuplicateEntryError('This user already exists in the database'));
                }
                return model.create(values);
            }).then((instance) => {
                resolve(new User(instance));
            }).catch((error) => {
                reject(new errors.FailedQueryError(error.message));
            });
        });
    }
}

module.exports = User;