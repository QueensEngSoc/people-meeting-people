const expect = require('chai').expect;
const DatabaseManager = require('../../server/database');
const lit = require('../../server/utilities/literals');

describe("DatabaseManager constructor", function () {
    it("should create database manager without error", function (done) {
        try {
            let dbm = new DatabaseManager();
            done();
        } catch (err) {
            done(err);
        }
    });
    it("should create a valid connection to the database", function () {
        let dbm = new DatabaseManager();
        return new Promise(resolve => {
            dbm.connection_.authenticate().then(() => {
                return dbm.connection_.close();
            }).then(() => {
                resolve();
            })
        });
    });
    it('should create a collection of sequelize models', function () {
        let dbm = new DatabaseManager();
        expect(dbm.models_).to.be.a('object').that.have.all.keys(lit.tables.USERS,
            lit.tables.PROFILES, lit.tables.HOUSING_GROUPS, lit.tables.HOUSING_GROUP_PROFILES,
            lit.tables.HOUSING_PREFERENCES);
    });
});