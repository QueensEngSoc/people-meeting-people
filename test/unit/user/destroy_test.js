const chai = require("chai"),
    chaiAsPromised = require('chai-as-promised'),
    should = chai.should();
chai.use(chaiAsPromised);
const DatabaseManager = require('../../../server/database/database_manager');
const lit = require('../../../server/utilities/literals');
const _ = require('underscore');

describe('User.destroy()', function () {
    let dbm = new DatabaseManager();
    before(function () {
        return dbm.createUser({netId: '12ab3', name: 'Test User', email: '12ab3@queensu.ca'});
    });
    after(function () {
        return dbm.models_[lit.tables.USERS].findById('12ab3').then(user => {
            return user.destroy();
        });
    });

});