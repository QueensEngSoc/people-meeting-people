const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;
const should = chai.should();
const DatabaseManager = require('../../server/database');
const lit = require('../../server/utilities/literals');

describe("DatabaseManager constructor", function () {
    it("should create database manager without error", function () {
        expect(() => new DatabaseManager()).to.not.throw();
    });
    it("should create a valid connection to the database", function () {
        let dbm = new DatabaseManager();
        return dbm.connection_.authenticate().should.be.fulfilled;
    });
    it('should create a collection of sequelize models', function () {
        let dbm = new DatabaseManager();
        expect(dbm.models_).to.be.a('object').that.have.all.keys(lit.tables.USERS,
            lit.tables.PROFILES, lit.tables.HOUSING_GROUPS, lit.tables.HOUSING_GROUP_PROFILES,
            lit.tables.HOUSING_PREFERENCES);
    });
});