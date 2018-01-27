const chai = require("chai"),
    chaiAsPromised = require('chai-as-promised'),
    should = chai.should();
chai.use(chaiAsPromised);
const DatabaseManager = require('../../../server/database/database_manager');
const lit = require('../../../server/utilities/literals');
const err = require('../../../server/utilities/error');
const _ = require('underscore');

describe('DatabaseManager.getHousingGroup', function () {
    let dbm = new DatabaseManager();
    let groupId;
    before(function () {
        return dbm.createUser({netId: '12ab3', name: 'Test User', email: '12ab3@queensu.ca'}).then(user => {
            return user.instance_.createHousingGroup({size: 4, spotsLeft: 3});
        }).then(user => {
            return user.getHousingGroup();
        }).then(group => {
            groupId = group.get('groupId');
        });
    });
    after(function () {
        return dbm.getUserById('12ab3').then(user => {
            return user.instance_.getHousingGroup();
        }).then(group => {
            return group.destroy();
        }).then(() => {
            return dbm.getUserById('12ab3');
        }).then(user => {
            return user.instance_.destroy();
        });
    });
    describe('getHousingGroupById()', function () {
        it('should resolve null for a group id that does not exist', function () {
            return dbm.getHousingGroupById(12345678).should.eventually.be.null;
        });
        it('should resolve a valid housing group with correct info', function () {
            return dbm.getHousingGroupById(groupId).then(group => {
                return group.instance_.get('groupId').should.equal(groupId);
            });
        });
    });

    describe('getHousingGroupByUser()', function () {
        before(function () {
            return dbm.createUser({netId: '12ab4', name: 'Second User', email: '12ab4@queensu.ca'});
        });
        after(function () {
            return dbm.models_[lit.tables.USERS].findById('12ab4').then(user => {
                return user.destroy();
            });
        });
        it('should resolve null for a user that does not belong to a group', function () {
            return dbm.getUserById('12ab4').then(user => {
                return dbm.getHousingGroupByUser(user).should.eventually.be.null;
            });
        });
        it('should resolve a valid housing group with correct info', function () {
            return dbm.getUserById('12ab3').then(user => {
                return dbm.getHousingGroupByUser(user);
            }).then(group => {
                return group.instance_.get('groupId').should.equal(groupId);
            });
        });
    });
});