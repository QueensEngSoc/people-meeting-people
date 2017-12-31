const expect = require('chai').expect;
const DatabaseManager = require('../../server/database');
const lit = require('../../server/utilities/literals');

describe('retrieving a user from the database', () => {
    let dbm = new DatabaseManager();
    it('should return null for a user that does not exist', () => {
        dbm.getUser('11111').then(result => {
            expect(result).to.be.a('null');
        });
    });
    it('should return a User object with all necessary info', () => {
        dbm.createUser({netId: '12ab3', name: 'Test User', email: '12ab3@queensu.ca'}).then(() => {
            return dbm.getUser('12ab3');
        }).then((result) => {
            expect(result).to.be.a('object');
            expect(result.instance_).to.be.a('object');
            expect(result.instance_.get('netId')).to.equal('12ab3');
            expect(result.instance_.get('name')).to.equal('Test User');
            expect(result.instance_.get('email')).to.equal('12ab3@queensu.ca');
            return result.instance_.destroy();
        });
    })
});