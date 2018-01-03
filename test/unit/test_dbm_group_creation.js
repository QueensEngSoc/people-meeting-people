const chai = require("chai");
const expect = chai.expect;
const DatabaseManager = require('../../server/database');
const lit = require('../../server/utilities/literals');
const err = require('../../server/utilities/error');

describe('function to create a new housing group', function () {
    let dbm = new DatabaseManager();
    let testUser = {};
    before(() => {
        return dbm.createUser({netId: '12ab3', name: 'Test User', email: '12ab3@queensu.ca'}).then(user => {
            testUser = user;
        })
    });
    it('should create a new group without error', function () {
        return dbm.createGroup(testUser, 4);
    });
    it('should have created a group with correct basic info', function () {
        return testUser.instance_.getHousingGroup().then(group => {
            expect(group.get('size')).to.equal(4);
            expect(group.get('spotsLeft')).to.equal(3);
            return group.getInitiator();
        }).then(initiator => {
            expect(initiator.get('netId')).to.equal('12ab3');
        });
    });
    after(() => {
        testUser.instance_.getHousingGroup().then(group => {
            group.destroy();
            return testUser.instance_.destroy();
        });
    });
});