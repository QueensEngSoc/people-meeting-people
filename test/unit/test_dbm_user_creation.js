const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;
const should = chai.should();
const DatabaseManager = require('../../server/database');
const lit = require('../../server/utilities/literals');
const err = require('../../server/utilities/error');

describe("function to create a new user in the database", function () {
    let dbm = new DatabaseManager();
    it("should create new user with all correct info", function () {
        return dbm.createUser({netId: '12ab3', name: 'Test User', email: '12ab3@queensu.ca'}).then(() => {
            return dbm.models_[lit.tables.USERS].findById('12ab3');
        }).then((result) => {
            expect(result.get('netId')).to.equal('12ab3');
            expect(result.get('name')).to.equal('Test User');
            expect(result.get('email')).to.equal('12ab3@queensu.ca');
        });
    });
    it("should not allow another user with the same netId", function () {
        return dbm.createUser({netId: '12ab3', name: 'Second User', email: 'second@test.ca'})
            .should.be.rejectedWith(err.DuplicateEntryError);
    });
    it("should not allow users with invalid input values", function () {
        return dbm.createUser({netId: '12ab3!', name: 'Second2 User', email: 'second@test.ca'})
            .should.be.rejectedWith(err.IllegalEntryError);
    });
    after(() => {
        let users = dbm.models_[lit.tables.USERS];
        return users.findById('12ab3').then(result => {
            return result.destroy();
        });
    });
});