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
    constructor(instance) {
        this.instance_ = instance
    }

    static createUser(values, model) {
        return new Promise((resolve, reject) => {
            model.findById(values[lit.fields.USER_ID]).then((result) => {
                if (result == null) reject(
                    new errors.DuplicateEntryError('This user already exists in the database'));
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