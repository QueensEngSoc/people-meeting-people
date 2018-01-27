const chai = require("chai"),
    chaiAsPromised = require('chai-as-promised'),
    should = chai.should();
chai.use(chaiAsPromised);
const DatabaseManager = require('../../../server/database/database_manager');
const lit = require('../../../server/utilities/literals');
const _ = require('underscore');

describe('User.getInfo()', function () {
    let dbm = new DatabaseManager();
    before(() => {
        return dbm.createUser({netId: '12ab3', name: 'Test User', email: '12ab3@queensu.ca'}).then(user => {
            return user.updateInfo({
                year: '1', faculty: 'Engineering', gender: 'Male',
                selfDescription: 'We are we are we are we are we are the engineers',
                houseType: 'House', housemateGender: 'Female'
            });
        });
    });
    after(() => {
        return dbm.models_[lit.tables.USERS].findById('12ab3').then(user => {
            return user.destroy();
        });
    });
    it('should return correct info for all requested fields', function () {
        return dbm.getUserById('12ab3').then(testUser => {
            return Promise.all([
                testUser.getInfo('netId').should.eventually.equal('12ab3'),
                testUser.getInfo('name').should.eventually.equal('Test User'),
                testUser.getInfo('email').should.eventually.equal('12ab3@queensu.ca'),
                testUser.getInfo('year').should.eventually.equal('1'),
                testUser.getInfo('faculty').should.eventually.equal('Engineering'),
                testUser.getInfo('gender').should.eventually.equal('Male'),
                testUser.getInfo('houseType').should.eventually.equal('House'),
                testUser.getInfo('housemateGender').should.eventually.equal('Female')
            ]);
        })
    });
    it('should return a json object when no field is supplied as input', function () {
        return dbm.getUserById('12ab3').then(user => {
            return user.getInfo();
        }).then(info => {
            info.should.be.a('object');
            info['netId'].should.equal('12ab3');
            info['name'].should.equal('Test User');
            info['email'].should.equal('12ab3@queensu.ca');
            info['profile'].should.be.a('object');
            info['profile'].should.not.have.property('profileId');
            info['profile']['year'].should.equal('1');
            info['profile']['faculty'].should.equal('Engineering');
            info['profile']['preference'].should.be.a('object');
            info['profile']['preference'].should.not.have.property('preferenceId');
            info['profile']['preference']['houseType'].should.equal('House');
            info['profile']['preference']['housemateGender'].should.equal('Female');
        });
    });
});