const chai = require("chai"),
    chaiAsPromised = require('chai-as-promised'),
    should = chai.should();
chai.use(chaiAsPromised);
const DatabaseManager = require('../../../server/database/database_manager');
const lit = require('../../../server/utilities/literals');
const _ = require('underscore');

describe('HousingGroup.getInfo()', function () {
    let dbm = new DatabaseManager();
    let groupId;
    before(function () {
        return dbm.createUser({netId: '12ab3', name: 'Test User', email: '12ab3@queensu.ca'}).then(user => {
            return dbm.createHousingGroup(user, 4);
        }).then(group => {
            groupId = group.instance_.get('groupId');
        })
    });
    after(function () {
        return dbm.getHousingGroupById(groupId).then(group => {
            return group.dissolve();
        }).then(() => {
            return dbm.getUserById('12ab3');
        }).then(user => {
            return user.destroy();
        });
    });
});