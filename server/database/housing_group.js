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
    return new Promise((resolve, reject) => {
      let groupInfo = _.pick(this.instance_.get(), (value, key) => _.contains(_.values(lit.fields.HOUSING_GROUP), key));
      this.instance_.getGroupProfile().then(profile => {
        groupInfo['profile'] = _.pick(profile.get(), (value, key) =>
          _.contains(_.values(lit.fields.HOUSING_GROUP_PROFILE), key));
        if (field == null)
          resolve(groupInfo);
        else if (_.contains(_.values(lit.fields.HOUSING_GROUP), field))
          resolve(groupInfo[field]);
        else if (field === 'groupProfile')
          resolve(groupInfo.profile);
        else if (_.contains(_.values(lit.fields.HOUSING_GROUP_PROFILE), field))
          resolve(groupInfo.profile[field]);
        else
          throw new errors.IllegalEntryError('invalid field name: ' + field);
      }).catch(error => {
        if (error instanceof errors.BaseError)
          return reject(error);
        return reject(new errors.FailedQueryError(error.message));
      });
    });
  }

  updateInfo(values) {
    let thisGroup = this;
    return new Promise((resolve, reject) => {
      if (lit.fields.USER.ID in values) {
        throw new errors.IllegalEntryError('Attempting to change netID');
      }
      let groupInfo = _.pick(values, (value, key) => _.contains(_.values(lit.fields.HOUSING_GROUP), key));
      let profile = _.pick(values, (value, key) => _.contains(_.values(lit.fields.HOUSING_GROUP_PROFILE), key));
      this.instance_.update(groupInfo).then(() => {
        return this.instance_.getGroupProfile();
      }).then(profileObj => {
        return profileObj.update(profile);
      }).then(() => {
        resolve(thisGroup);
      }).catch((error) => {
        if (error instanceof errors.BaseError)
          return reject(error);
        return reject(new errors.FailedQueryError(error.message));
      });
    });
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
      if (this.instance_.get(lit.fields.HOUSING_GROUP.SPOTS_LEFT) === 0) {
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

  removeUser(member, newInitiator) {
    return new Promise(function (resolve, reject) {
      member.instance_.getHousingGroup().then(group => {
        if (group == null || group.get('groupId') !== this.instance_.get('groupId'))
          throw new errors.InvalidOperationError('This user is not in this group');
        if (this.instance_.get('spotsLeft') === this.instance_.get('size') - 1)
          return this.dissolve();
        return this.instance_.updateInfo({spotsLeft: group.get('spotsLeft') + 1});
      }).then(group => {
        if (group.getInitiator().get('netId') === member.instance_.get('netId')) {
          return this.transferOwnershipTo(newInitiator).then(() => {
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
    return new Promise(function (resolve, reject) {
      this.instance_.getMembers().then(members => {
        let allMembers = [];
        for (let member in members) {
          allMembers.push(new User(member));
        }
        return resolve(allMembers);
      }).catch(err => {
        if (err instanceof errors.DatabaseError) {
          return reject(err);
        }
        return reject(new errors.FailedQueryError(err.message));
      });
    })
  }

  getInitiator() {
    return new Promise(function (resolve, reject) {
      this.instance_.getInitiator().then(initiator => {
        return resolve(new User(initiator));
      }).catch(err => {
        if (err instanceof errors.DatabaseError) {
          return reject(err);
        }
        return reject(new errors.FailedQueryError(err.message));
      });
    })
  }

  dissolve() {
    return this.instance_.destroy();
  }

  transferOwnershipTo(member) {
    return new Promise(function (resolve, reject) {
      this.instance_.setInitiator(member.instance_).then(() => {
        resolve(this);
      }).catch(err => {
        if (err instanceof errors.DatabaseError) {
          return reject(err);
        }
        return reject(new errors.FailedQueryError(err.message));
      });
    })
  }

  constructor(instance) {
    this.instance_ = instance;
  }
}

module.exports = HousingGroup;