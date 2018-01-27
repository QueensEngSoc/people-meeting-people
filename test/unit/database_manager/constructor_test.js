const chai = require("chai"),
    chaiAsPromised = require('chai-as-promised'),
    should = chai.should();
chai.use(chaiAsPromised);
const DatabaseManager = require('../../../server/database/database_manager');
const lit = require('../../../server/utilities/literals');
const _ = require('underscore');

describe('DatabaseManager constructor', function () {
    it('should create a valid connection to MySQL', function () {
        let dbm = new DatabaseManager();
        return dbm.connection_.authenticate().should.be.fulfilled;
    });
    it('should create an array of Sequelize models corresponding to each table', function () {
        let dbm = new DatabaseManager();
        dbm.models_.should.be.a('object').that.have.all.keys(_.values(lit.tables));
    });
});