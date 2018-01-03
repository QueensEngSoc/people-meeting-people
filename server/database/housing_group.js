/**
 * @fileoverview The interface object for operations with a housing group
 * @author astral.cai@queensu.ca
 */

'use strict';

const Sequelize = require('sequelize');
const lit = require('../utilities/literals');
const errors = require('../utilities/error');
const _ = require('underscore');

/**
 * The interface object for functionality relating to housing groups
 */
class HousingGroup {
    constructor(instance) {
        this.instance_ = instance;
    }

    static createGroup(initiator, groupSize, model) {
        return new Promise((resolve, reject) => {
            initiator.instance_.getHousingGroup().then(group => {
                if (group != null) {
                    throw new errors.DuplicateEntryError("This user already belongs to a group");
                }
                return initiator.instance_.createHousingGroup({size: groupSize, spotsLeft: groupSize - 1});
            }).then(user => {
                return user.getHousingGroup().then(group => {
                    return group.setInitiator(user);
                })
            }).then(group => {
                resolve(new HousingGroup(group));
            }).catch(err => {
                if (err instanceof errors.BaseError) {
                    return reject(err);
                }
                return reject(new errors.FailedQueryError(err.message));
            });
        });
    }
}

module.exports = HousingGroup;