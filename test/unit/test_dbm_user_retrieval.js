const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;
const should = chai.should();
const DatabaseManager = require('../../server/database');
const lit = require('../../server/utilities/literals');
const User = require('../../server/database/user');

describe('function to retrieve a user from the database', function () {
    let dbm = new DatabaseManager();
    before(() => {
        return dbm.createUser({netId: '12ab3', name: 'Test User', email: '12ab3@queensu.ca'});
    });
    it('should return null for a user that does not exist', function () {
        return dbm.getUser('12345').should.eventually.be.null;
    });
    it('should resolve a User object with all correct info', function () {
        return dbm.getUser('12ab3').then((result) => {
            expect(result).to.be.an.instanceof(User);
            expect(result.instance_).to.be.a('object');
            expect(result.instance_.get('netId')).to.equal('12ab3');
            expect(result.instance_.get('name')).to.equal('Test User');
            expect(result.instance_.get('email')).to.equal('12ab3@queensu.ca');
        });
    });
    after(() => {
        return dbm.getUser('12ab3').then(result => {
            return result.instance_.destroy();
        });
    });
});