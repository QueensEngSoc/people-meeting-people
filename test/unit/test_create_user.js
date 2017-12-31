const expect = require('chai').expect;
const DatabaseManager = require('../../server/database');
const lit = require('../../server/utilities/literals');

describe("function to add a new user to the database", () => {
    it("should run without error", (done) => {
        let dbm = new DatabaseManager();
        dbm.createUser({netId: '12ab3', name: 'Test User', email: '12ab3@queensu.ca'}).then(() => {
            return dbm.createUser({netId: '12cd3', name: 'User Two', email: '12cd3@queensu.ca'});
        }).then(() => {
            done();
        }).catch((err) => {
            done(err);
        })
    });
    it("should have created two users in the database", (done) => {
        let dbm = new DatabaseManager();
        let users = dbm.models_[lit.tables.USERS];
        users.findById('12ab3').then((result) => {
            expect(result.get('name')).to.equal('Test User');
            expect(result.get('email')).to.equal('12ab3@queensu.ca');
            return result.destroy();
        }).then(() => {
            return users.findById('12cd3');
        }).then((result) => {
            expect(result.get('name')).to.equal('User Two');
            expect(result.get('email')).to.equal('12cd3@queensu.ca');
            return result.destroy();
        }).then(() => {
            done();
        }).catch(err => {
            done(err);
        })
    })
});