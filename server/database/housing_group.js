/**
 * @fileoverview The interface object for operations with a housing group
 * @author astral.cai@queensu.ca
 */

'use strict';

const Sequelize = require('sequelize');
const lit = require('../utilities/literals');
const errors = require('../utilities/error');
const _ = require('underscore');
const User = require('./user');

/**
 * The interface object for functionality relating to housing groups
 */
class HousingGroup {

    getInfo(field) {

    }

    updateInfo(values) {

    }

    /**
     * adds a user to the group, interchangeable with User.joinGroup(), both returns a Promise
     * that resolves the source of the action. User.joinGroup() resolves the User object, while HousingGroup.addMember()
     * resolves the HousingGroup object.
     *
     * @param {User} newMember - the user to be added to the housing group
     * @returns {Promise<HousingGroup>}
     */
    addUser(newMember) {
        return new Promise(function (resolve, reject) {
            if (this.instance_.get('spotsLeft') === 0) {
                return reject(new errors.InvalidOperationError('This group is already full'));
            }
            if (newMember.instance_.get('housingGroupId') != null) {
                return reject(new errors.InvalidOperationError('This user already belongs to a housing group'));
            }
            this.instance_.addMember(newMember.instance_).then(group => {
                return group.update({'spotsLeft': group.get('spotsLeft') - 1});
            }).then(() => {
                return resolve(this);
            }).catch(err => {
                if (err instanceof errors.DatabaseError) {
                    return reject(err);
                }
                return reject(new errors.FailedQueryError(err.message));
            });
        });
    }

    removeUser(member) {
        return new Promise(function (resolve, reject) {
            member.instance_.getHousingGroup().then(group => {
                if (group == null || group.get('groupId') !== this.instance_.get('groupId'))
                    throw new errors.InvalidOperationError('This user is not in this group');
                if (this.instance_.get('spotsLeft') === this.instance_.get('size') - 1)
                    return this.dissolve();
                return this.instance_.updateInfo({spotsLeft: group.get('spotsLeft') + 1});
            }).then(group => {
                if (group.getInitiator().get('netId') === member.instance_.get('netId')) {
                    return this.transferOwnershipTo().then(() => {
                        return group.removeMember(member.instance_);
                    });
                }
                return group.removeMember(member.instance_);
            }).then(() => {
                return resolve(this);
            }).catch(err => {
                if (err instanceof errors.DatabaseError) {
                    return reject(err);
                }
                return reject(new errors.FailedQueryError(err.message));
            });
        });
    }

    getMembers() {

    }

    getInitiator() {

    }

    dissolve() {

    }

    transferOwnershipTo(member) {

    }

    constructor(instance) {
        this.instance_ = instance;
    }
}

module.exports = HousingGroup;