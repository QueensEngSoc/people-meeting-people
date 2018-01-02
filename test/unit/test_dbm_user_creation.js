const expect = require('chai').expect;
const DatabaseManager = require('../../server/database');
const lit = require('../../server/utilities/literals');

describe("function to add a new user to the database", () => {
    let dbm = new DatabaseManager();
    it("should run without error", () => {
        return new Promise((resolve, reject) => {
            dbm.createUser({netId: '12ab3', name: 'Test User', email: '12ab3@queensu.ca'}).then(() => {
                resolve();
            }).catch(reject);
        });
    });
    it("should have created one user in the database", () => {
        return new Promise((resolve, reject) => {
            let users = dbm.models_[lit.tables.USERS];
            users.findById('12ab3').then((result) => {
                expect(result.get('netId')).to.equal('12ab3');
                expect(result.get('name')).to.equal('Test User');
                expect(result.get('email')).to.equal('12ab3@queensu.ca');
                resolve();
            }).catch(reject);
        });
    });
    after((done) => {
        dbm.getUser('12ab3').then(result => {
            return result.instance_.destroy();
        }).then(() => {
            done();
        });
    });
});