const chai = require("chai"),
    chaiAsPromised = require('chai-as-promised'),
    should = chai.should();
chai.use(chaiAsPromised);
const DatabaseManager = require('../../../server/database/database_manager');
const lit = require('../../../server/utilities/literals');
const err = require('../../../server/utilities/error');
const _ = require('underscore');

describe('DatabaseManager.createHousingGroup()', function () {
    let dbm = new DatabaseManager();
    before(function () {
        return dbm.createUser({netId: '12ab3', name: 'Test User', email: '12ab3@queensu.ca'});
    });
    after(function () {
        return dbm.models_[lit.tables.USERS].findById('12ab3').then(user => {
            return user.destroy();
        });
    });
    afterEach(function () {
        return dbm.models_[lit.tables.USERS].findById('12ab3').then(user => {
            return user.getHousingGroup();
        }).then(group => {
            if (group != null)
                return group.destroy();
        });
    });
    it('should create a valid housing group object with correct info', function () {
        return dbm.getUserById('12ab3').then(user => {
            return dbm.createHousingGroup(user, 4);
        }).then(group => {
            group.instance_.get('size').should.equal(4);
            group.instance_.get('spotsLeft').should.equal(3);
            return group.instance_.getInitiator();
        }).then(initiator => {
            initiator.get('netId').should.equal('12ab3');
            return initiator.getHousingGroup();
        }).then(group => {
            return group.getMembers();
        }).then(members => {
            members.should.have.lengthOf(1);
            members[0].get('netId').should.equal('12ab3');
        });
    });
    it('should reject if a user who already belongs to a group tries to start a group', function () {
        return dbm.getUserById('12ab3').then(user => {
            return dbm.createHousingGroup(user, 4);
        }).then(() => {
            return dbm.getUserById('12ab3');
        }).then(user => {
            return dbm.createHousingGroup(user, 6).should.be.rejectedWith(err.InvalidOperationError);
        });
    });
    it('should reject if given illegal input', function () {
        return dbm.getUserById('12ab3').then(user => {
            return dbm.createHousingGroup(user, -1).should.be.rejectedWith(err.IllegalEntryError);
        });
    });
});