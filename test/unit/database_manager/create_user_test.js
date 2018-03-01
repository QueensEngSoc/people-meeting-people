const chai = require("chai"),
  chaiAsPromised = require('chai-as-promised'),
  should = chai.should();
chai.use(chaiAsPromised);
const DatabaseManager = require('../../../server/database/database_manager');
const lit = require('../../../server/utilities/literals');
const err = require('../../../server/utilities/error');
const _ = require('underscore');

describe('DatabaseManager.createUser()', function () {
  let dbm = new DatabaseManager();
  afterEach(function () {
    return dbm.models_[lit.tables.USERS].findById('12ab3').then(result => {
      if (result != null) return result.destroy();
    });
  });
  it('should create a user with correct basic info', function () {
    return dbm.createUser({netId: '12ab3', name: 'Test User', email: '12ab3@queensu.ca'}).then(newUser => {
      newUser.instance_.get('netId').should.equal('12ab3');
      newUser.instance_.get('name').should.equal('Test User');
      newUser.instance_.get('email').should.equal('12ab3@queensu.ca');
    });
  });
  it('should not allow a new user with a duplicate netId', function () {
    return dbm.createUser({netId: '12ab3', name: 'Test User', email: '12ab3@queensu.ca'}).then(() => {
      return dbm.createUser({netId: '12ab3', name: 'Second User', email: '12ab3@queensu.ca'})
        .should.be.rejectedWith(err.DuplicateEntryError);
    });
  });
  it('should not allow invalid inputs', function () {
    return dbm.createUser({netId: '12ab3', name: 'Test User', email: '12ab3@queensu.ca'}).then(newUser => {
      return Promise.all([
        dbm.createUser({netId: '12ab3!', name: 'Test User', email: '12ab3@queensu.ca'})
          .should.be.rejectedWith(err.IllegalEntryError),
        dbm.createUser({netId: '11ab3', name: 'Test User*', email: '12ab3@queensu.ca'})
          .should.be.rejectedWith(err.IllegalEntryError),
        dbm.createUser({netId: '11ab3', name: 'Test User', email: '12ab3@@@queensu.ca'})
          .should.be.rejectedWith(err.IllegalEntryError)
      ]);
    });
  });
});