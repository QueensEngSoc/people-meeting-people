const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;
const should = chai.should();
const DatabaseManager = require('../../server/database');
const lit = require('../../server/utilities/literals');
const User = require('../../server/database/user');

describe('function to retrieve user info', function () {
    let dbm = new DatabaseManager();
    let testUser = {};
    before(() => {
        return dbm.createUser({netId: '12ab3', name: 'Test User', email: '12ab3@queensu.ca'}).then(user => {
            return user.updateInfo({
                year: '1', faculty: 'Engineering', gender: 'Male',
                selfDescription: 'We are we are we are we are we are the engineers',
                houseType: 'House', housemateGender: 'Female'
            }).then(result => {
                testUser = result;
            })
        });
    });
    it('should return correct values for all requests', function () {
        return Promise.all([
            testUser.getInfo('netId').should.eventually.equal('12ab3'),
            testUser.getInfo('name').should.eventually.equal('Test User'),
            testUser.getInfo('email').should.eventually.equal('12ab3@queensu.ca'),
            testUser.getInfo('year').should.eventually.equal('1'),
            testUser.getInfo('faculty').should.eventually.equal('Engineering'),
            testUser.getInfo('houseType').should.eventually.equal('House')
        ]);
    });
    it('should return a full json object containing necessary info', function () {
        return dbm.getUser('12ab3').then(user => {
            return user.getInfo();
        }).then(info => {
            expect(info).to.be.a('object');
            expect(info['netId']).to.equal('12ab3');
            expect(info['name']).to.equal('Test User');
            expect(info['profile']).to.be.a('object');
            expect(info['profile']).to.not.have.property('profileId');
            expect(info['profile']['year']).to.equal('1');
            expect(info['profile']['faculty']).to.equal('Engineering');
            expect(info['profile']['preference']).to.be.a('object');
            expect(info['profile']['preference']).to.not.have.property('preferenceId');
            expect(info['profile']['preference']['houseType']).to.equal('House');
        });
    });
    after(() => {
        return testUser.instance_.destroy();
    });
});