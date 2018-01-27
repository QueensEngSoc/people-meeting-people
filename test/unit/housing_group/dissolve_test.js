const chai = require("chai"),
    chaiAsPromised = require('chai-as-promised'),
    should = chai.should();
chai.use(chaiAsPromised);
const DatabaseManager = require('../../../server/database/database_manager');
const lit = require('../../../server/utilities/literals');
const _ = require('underscore');

describe('HousingGroup.dissolve()', function () {
    let dbm = new DatabaseManager();
    let groupId;
    before(function () {
        return dbm.createUser({netId: '12ab3', name: 'Test User', email: '12ab3@queensu.ca'}).then(user => {
            return dbm.createHousingGroup(user, 4);
        }).then(group => {
            groupId = group.instance_.get('groupId');
        });
    });
    afterEach(function () {
        return dbm.getHousingGroupById(groupId).then(group => {
            return group.instance_.destroy();
        }).then(() => {
            return dbm.getUserById('12ab3');
        }).then(user => {
            return user.instance_.destroy();
        }).then(() => {
            return dbm.createUser({netId: '12ab3', name: 'Test User', email: '12ab3@queensu.ca'});
        }).then(user => {
            return dbm.createHousingGroup(user, 4);
        }).then(group => {
            groupId = group.instance_.get('groupId');
        });
    });
    after(function () {
        return dbm.getHousingGroupById(groupId).then(group => {
            return group.instance_.destroy();
        }).then(() => {
            return dbm.getUserById('12ab3');
        }).then(user => {
            return user.instance_.destroy();
        });
    });
    it('should successfully delete the group from the database', function () {
        return dbm.getHousingGroupById(groupId).then(group => {
            return group.dissolve();
        }).then(() => {
            return dbm.getHousingGroupById(groupId).should.eventually.be.null;
        });
    });
    it('should set the group of the former members to null', function () {
        return dbm.getHousingGroupById(groupId).then(group => {
            return group.dissolve();
        }).then(() => {
            return dbm.getUserById('12ab3');
        }).then(user => {
            return dbm.getHousingGroupByUser(user).should.eventually.be.null;
        });
    });
});