/**
 * @fileoverview The interface object for all operations relating to users
 * @author astral.cai (Astral Cai)
 */

"use strict";

const Sequelize = require('sequelize');
const lit = require('../utilities/literals');
const errors = require('../utilities/error');
const _ = require('underscore');

/**
 * The interface object for functionality relating to users
 */
class User {
    /**
     *
     * @param {Object} values
     * @param {String} [values.name] The name of the user
     * @param {String} [values.email] The email of the user
     * @param {String} [values.year] The year of the user
     * @param {String} [values.faculty] The faculty of the user
     * @param {String} [values.gender] The gender of the user (Male, Female, or Other)
     * @param {String} [values.genderIfOther] If "Other" is selected for gender, what the user identify with
     * @param {String} [values.selfDescription] The self description of the user
     * @param {String} [values.houseType] user preferred type of housing (House or Appartment)
     * @param {String} [values.housemateGender] user preferred housemate gender
     * @param {String} [values.housemateFaculty] user preferred housemate faculty
     * @returns {Promise<User>}
     */
    updateInfo(values) {
        let thisUser = this;
        return new Promise((resolve, reject) => {
            if (lit.fields.USER.ID in values) {
                throw new errors.IllegalEntryError('Attempting to change netID');
            }
            let userInfo = _.pick(values, (value, key) => _.contains(_.values(lit.fields.USER), key));
            let profile = _.pick(values, (value, key) => _.contains(_.values(lit.fields.PROFILE), key));
            let preference = _.pick(values, (value, key) => _.contains(_.values(lit.fields.HOUSING_PREFERENCE), key));
            this.instance_.update(userInfo).then(() => {
                return this.instance_.getProfile();
            }).then(profileObj => {
                return profileObj.update(profile).then(() => {
                    return profileObj.getPreference();
                });
            }).then(preferenceObj => {
                return preferenceObj.update(preference);
            }).then(() => {
                resolve(thisUser);
            }).catch((error) => {
                if (error instanceof errors.BaseError)
                    return reject(error);
                return reject(new errors.FailedQueryError(error.message));
            });
        });
    }

    /**
     * deletes this user from the database
     */
    destroy() {
        return this.instance_.destroy();
    }

    constructor(instance) {
        this.instance_ = instance;
    }

    static createUser(values, models) {
        return new Promise((resolve, reject) => {
            let thisUser = {};
            models[lit.tables.USERS].findById(values[lit.fields.USER.ID]).then((result) => {
                if (result != null) {
                    throw new errors.DuplicateEntryError('This user already exists in the database');
                }
                values['profile'] = {'preference': {}};
                return models[lit.tables.USERS].create(values);
            }).then(instance => {
                thisUser = new User(instance);
                return models[lit.tables.PROFILES].create({});
            }).then(profile => {
                return thisUser.instance_.setProfile(profile).then(() => {
                    return models[lit.tables.HOUSING_PREFERENCES].create({});
                });
            }).then(preference => {
                return thisUser.instance_.getProfile().then(profile => {
                    return profile.setPreference(preference);
                });
            }).then(() => {
                resolve(thisUser);
            }).catch((error) => {
                if (error instanceof errors.BaseError)
                    return reject(error);
                return reject(new errors.FailedQueryError(error.message));
            });
        });
    }

    static getUser(userId, model) {
        return new Promise((resolve, reject) => {
            model.findById(userId).then((result) => {
                if (result == null) {
                    resolve(null);
                } else {
                    resolve(new User(result));
                }
            }).catch(err => {
                reject(new errors.FailedQueryError(error.message));
            });
        });
    }
}

module.exports = User;