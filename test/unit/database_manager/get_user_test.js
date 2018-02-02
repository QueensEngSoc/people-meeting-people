const chai = require("chai"),
    chaiAsPromised = require('chai-as-promised'),
    should = chai.should();
chai.use(chaiAsPromised);
const DatabaseManager = require('../../../server/database/database_manager');
const User = require('../../../server/database/user');
const lit = require('../../../server/utilities/literals');
const err = require('../../../server/utilities/error');
const _ = require('underscore');

describe('DatabaseManager.getUserById()', function () {
    let dbm = new DatabaseManager();
    before(function () {
        return dbm.createUser({netId: '12ab3', name: 'Test User', email: '12ab3@queensu.ca'});
    });
    after(function () {
        return dbm.models_[lit.tables.USERS].findById('12ab3').then(user => {
            return user.destroy();
        });
    });
    it('should resolve null if the user does not exist', function () {
        return dbm.getUserById('12345').should.eventually.be.null;
    });
    it('should resolve a valid user with correct info', function () {
        return dbm.getUserById('12ab3').then(user => {
            user.should.be.an.instanceof(User);
            user.instance_.get('netId').should.equal('12ab3');
            user.instance_.get('name').should.equal('Test User');
            user.instance_.get('email').should.equal('12ab3@queensu.ca');
        })
    });
});