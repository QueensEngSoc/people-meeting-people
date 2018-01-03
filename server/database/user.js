/**
 * @fileoverview The interface object for all operations relating to users
 * @author astral.cai@queensu.ca (Astral Cai)
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
     * gets user info, takes a string as input, resolves the requested info, if nothing is supplied to the function,
     * it resolves a full json object containing all relevant info of the user
     *
     * @param {String} [field] - the target field of user info
     * @returns {Promise}
     */
    getInfo(field) {
        return new Promise((resolve, reject) => {
            let userInfo = _.pick(this.instance_.get(), (value, key) => _.contains(_.values(lit.fields.USER), key));
            this.instance_.getProfile().then(profile => {
                userInfo['profile'] = _.pick(profile.get(), (value, key) =>
                    _.contains(_.values(lit.fields.PROFILE), key));
                return profile.getPreference();
            }).then(preference => {
                userInfo['profile']['preference'] = _.pick(preference.get(), (value, key) =>
                    _.contains(_.values(lit.fields.HOUSING_PREFERENCE), key));
                if (field == null)
                    resolve(userInfo);
                else if (_.contains(_.values(lit.fields.USER), field))
                    resolve(userInfo[field]);
                else if (field === 'profile')
                    resolve(userInfo.profile);
                else if (_.contains(_.values(lit.fields.PROFILE), field))
                    resolve(userInfo.profile[field]);
                else if (field === 'preference')
                    resolve(userInfo.profile.preference);
                else if (_.contains(_.values(lit.fields.HOUSING_PREFERENCE), field))
                    resolve(userInfo.profile.preference[field]);
                else
                    throw new errors.IllegalEntryError('invalid field name: ' + field);
            }).catch(error => {
                if (error instanceof errors.BaseError)
                    return reject(error);
                return reject(new errors.FailedQueryError(error.message));
            });
        });
    }

    /**
     * updates user info, takes a json object as its input, and updates all fields accordingly
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

    static createUser(values, model) {
        return new Promise((resolve, reject) => {
            let thisUser = {};
            model.findById(values[lit.fields.USER.ID]).then((result) => {
                if (result != null) {
                    throw new errors.DuplicateEntryError('This user already exists in the database');
                }
                values['profile'] = {'preference': {}};
                return model.create(values);
            }).then(instance => {
                thisUser = new User(instance);
                return instance.createProfile({});
            }).then(profile => {
                return profile.createPreference({});
            }).then(() => {
                resolve(thisUser);
            }).catch((error) => {
                if (error instanceof errors.BaseError)
                    return reject(error);
                if (error instanceof Sequelize.ValidationError)
                    return reject(new errors.IllegalEntryError(error.message));
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