const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;
const should = chai.should();
const DatabaseManager = require('../../server/database');
const _ = require('underscore');
const lit = require('../../server/utilities/literals');

describe('functions that operate on User objects', function () {
    let dbm = new DatabaseManager();
    let testUser = {};
    before(() => {
        return dbm.createUser({netId: '12ab3', name: 'Test User', email: '12ab3@queensu.ca'}).then(user => {
            testUser = user;
        });
    });
    after(() => {
        return dbm.getUser('12ab3').then(user => {
            if (user != null)
                return user.instance_.destroy();
        })
    });
    describe('functions that updates user info', function () {
        it('should update basic user info without error', function () {
            return testUser.updateInfo({name: 'New User', email: 'test@gmail.com'}).then((user) => {
                expect(user.instance_.get('name')).to.equal('New User');
                expect(user.instance_.get('email')).to.equal('test@gmail.com');
            });
        });
        it('should update profile of user without error', function () {
            return testUser.updateInfo({
                year: '1', faculty: 'Engineering', gender: 'Male',
                selfDescription: 'We are we are we are we are we are the engineers'
            }).then(user => {
                return user.instance_.getProfile();
            }).then(profile => {
                expect(profile.get('faculty')).to.equal('Engineering');
                expect(profile.get('gender')).to.equal('Male');
                expect(profile.get('selfDescription')).to
                    .equal('We are we are we are we are we are the engineers');
            });
        });
        it('should update user housing preference without error', function () {
            return testUser.updateInfo({houseType: 'House', housemateGender: 'Female'}).then(user => {
                return user.instance_.getProfile();
            }).then(profile => {
                return profile.getPreference();
            }).then(preference => {
                expect(preference.get('houseType')).to.equal('House');
                expect(preference.get('housemateGender')).to.equal('Female');
            });
        });
    });
    describe('function to destroy user', function () {
        it('should destroy all corresponding rows related to the user', function () {
            let profileId = {};
            let preferenceId = {};
            return testUser.instance_.getProfile().then(profile => {
                profileId = profile.get('profileId');
                return profile.getPreference();
            }).then(preference => {
                preferenceId = preference.get('preferenceId');
                return testUser.destroy();
            }).then(() => {
                return Promise.all([
                    dbm.models_[lit.tables.USERS].findById('12ab3').should.eventually.be.null,
                    dbm.models_[lit.tables.PROFILES].findById(profileId).should.eventually.be.null,
                    dbm.models_[lit.tables.HOUSING_PREFERENCES].findById(preferenceId)
                        .should.eventually.be.null
                ]);
            });
        });
    });
});